<?php

namespace App\Http\Middleware;

use App\Services\CsvSyncService;
use Closure;
use Illuminate\Http\Request;

class AutoSyncBooks
{
    public function __construct(protected CsvSyncService $service) {}

    public function handle(Request $request, Closure $next)
    {
        // Hanya cek di route /api/books supaya tidak lambat di setiap request
        if ($request->is('api/books')) {
            if ($this->service->hasChanged()) {
                $this->service->sync();
            }
        }

        return $next($request);
    }
}