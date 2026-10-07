<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CsvSyncService
{
    protected string $csvPath;
    protected string $hashCacheKey = 'books_csv_hash';

    public function __construct()
    {
        // Path absolut langsung ke storage/app/books.csv
        $this->csvPath = storage_path('app/books.csv');
    }

    public function hasChanged(): bool
    {
        if (!file_exists($this->csvPath)) {
            return false;
        }

        $currentHash  = md5_file($this->csvPath);
        $previousHash = Cache::get($this->hashCacheKey, '');

        return $currentHash !== $previousHash;
    }

    public function sync(): array
    {
        if (!file_exists($this->csvPath)) {
            Log::warning('CsvSync: file tidak ditemukan di: ' . $this->csvPath);
            return [
                'status'  => 'error',
                'message' => 'File CSV tidak ditemukan di: ' . $this->csvPath
            ];
        }

        $csvContent = file_get_contents($this->csvPath);
        $rows       = $this->parseCsv($csvContent);

        if (empty($rows)) {
            return ['status' => 'error', 'message' => 'File CSV kosong atau format salah'];
        }

        $inserted = 0;
        $updated  = 0;
        $deleted  = 0;

        $csvIds = array_map('intval', array_column($rows, 'id'));

        foreach ($rows as $row) {
            $existing = Book::find((int) $row['id']);

            $data = [
                'title'       => $row['title'],
                'author'      => $row['author'],
                'year'        => (int) $row['year'],
                'rating'      => (float) $row['rating'],
                'cover'       => $row['cover'],
                'color'       => $row['color'],
                'description' => $row['description'],
                'features'    => array_map('trim', explode(',', $row['features'])),
            ];

            if ($existing) {
                $existing->update($data);
                $updated++;
            } else {
                Book::create(array_merge(['id' => (int) $row['id']], $data));
                $inserted++;
            }
        }

        // Hapus buku yang tidak ada di CSV
        $deletedBooks = Book::whereNotIn('id', $csvIds)->get();
        foreach ($deletedBooks as $book) {
            $book->wishlists()->delete();
            $book->ratings()->delete();
            $book->readingHistories()->delete();
            $book->compareLists()->delete();
            $book->delete();
            $deleted++;
        }

        // Simpan hash baru
        Cache::forever($this->hashCacheKey, md5_file($this->csvPath));

        Log::info("CsvSync selesai: {$inserted} ditambah, {$updated} diperbarui, {$deleted} dihapus");

        return [
            'status'   => 'success',
            'inserted' => $inserted,
            'updated'  => $updated,
            'deleted'  => $deleted,
        ];
    }

    protected function parseCsv(string $content): array
    {
        $rows   = [];
        $lines  = explode("\n", trim($content));
        $header = null;

        foreach ($lines as $i => $line) {
            $line = trim($line);
            if (empty($line)) continue;

            $columns = str_getcsv($line, ',', '"');

            if ($i === 0) {
                $header = array_map('trim', $columns);
                continue;
            }

            if (count($columns) !== count($header)) {
                Log::warning("CsvSync: baris {$i} tidak valid, dilewati");
                continue;
            }

            $rows[] = array_combine($header, $columns);
        }

        return $rows;
    }

    public function resetHash(): void
    {
        Cache::forget($this->hashCacheKey);
    }

    public function getLastHash(): string
    {
        return Cache::get($this->hashCacheKey, 'belum pernah sync');
    }
}