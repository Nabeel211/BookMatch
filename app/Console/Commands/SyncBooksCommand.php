<?php

namespace App\Console\Commands;

use App\Services\CsvSyncService;
use Illuminate\Console\Command;

class SyncBooksCommand extends Command
{
    protected $signature   = 'books:sync {--force : Paksa sync meskipun CSV tidak berubah}';
    protected $description = 'Sinkronisasi data buku dari file CSV ke database';

    public function handle(CsvSyncService $service): void
    {
        $this->info('BookMatch — Sinkronisasi Buku dari CSV');
        $this->line('');

        // Cek apakah CSV berubah
        if (!$this->option('force') && !$service->hasChanged()) {
            $this->info('✓ File CSV tidak berubah. Sync dilewati.');
            $this->line('  Gunakan --force untuk memaksa sync.');
            return;
        }

        $this->line('⏳ Menyinkronisasi data buku...');
        $result = $service->sync();

        if ($result['status'] === 'error') {
            $this->error('✗ Sync gagal: ' . $result['message']);
            return;
        }

        $this->info('✓ Sync berhasil!');
        $this->table(
            ['Aksi', 'Jumlah'],
            [
                ['Buku ditambahkan', $result['inserted']],
                ['Buku diperbarui',  $result['updated']],
                ['Buku dihapus',     $result['deleted']],
            ]
        );
    }
}