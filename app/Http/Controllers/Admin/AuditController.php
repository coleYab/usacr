<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditController extends Controller
{
    /**
     * Display a listing of immutable administrative audit trail logs.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $actionType = $request->input('action_type', 'all');
        $adminId = $request->input('admin_id', 'all');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $query = AdminAction::with(['admin', 'subject'])
            ->when($search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('description', 'like', "%{$search}%")
                        ->orWhere('action_type', 'like', "%{$search}%")
                        ->orWhereHas('admin', fn ($adminQuery) => $adminQuery->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->when($actionType !== 'all', fn ($q) => $q->where('action_type', $actionType))
            ->when($adminId !== 'all', fn ($q) => $q->where('admin_id', $adminId))
            ->when($dateFrom, fn ($q) => $q->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('created_at', '<=', $dateTo))
            ->latest();

        $actions = $query->paginate(20)->withQueryString();

        $admins = User::where('role', User::ROLE_ADMIN)->select('id', 'name', 'email')->get();
        $distinctActionTypes = AdminAction::distinct()->pluck('action_type');

        return Inertia::render('admin/audit', [
            'actions' => present_paginator($actions, function (array $items) {
                return array_map(function (AdminAction $action) {
                    return [
                        'id' => $action->id,
                        'admin_id' => $action->admin_id,
                        'admin_name' => $action->admin->name,
                        'admin_email' => $action->admin->email,
                        'action_type' => $action->action_type,
                        'subject_type' => class_basename($action->subject_type),
                        'subject_id' => $action->subject_id,
                        'description' => $action->description,
                        'created_at' => $action->created_at?->toISOString(),
                        'created_at_formatted' => $action->created_at?->format('M j, Y g:i A'),
                        'created_at_diff' => $action->created_at?->diffForHumans(),
                    ];
                }, $items);
            }),
            'stats' => [
                'total_actions' => AdminAction::count(),
                'actions_today' => AdminAction::whereDate('created_at', today())->count(),
                'active_admins_count' => AdminAction::distinct('admin_id')->count('admin_id'),
            ],
            'admins' => $admins,
            'action_types' => $distinctActionTypes,
            'filters' => [
                'search' => $search ?? '',
                'action_type' => $actionType,
                'admin_id' => $adminId,
                'date_from' => $dateFrom ?? '',
                'date_to' => $dateTo ?? '',
            ],
        ]);
    }
}
