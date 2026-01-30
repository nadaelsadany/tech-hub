import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
    actionLabel?: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    public readonly notifications$ = this.notificationsSubject.asObservable();

    /**
     * Create and add a notification
     */
    create(
        type: NotificationType,
        title: string,
        message: string,
        options?: {
            actionUrl?: string;
            actionLabel?: string;
        }
    ): Notification {
        const notification: Notification = {
            id: this.generateId(),
            type,
            title,
            message,
            timestamp: new Date().toISOString(),
            read: false,
            ...options
        };

        const notifications = this.notificationsSubject.value;
        this.notificationsSubject.next([notification, ...notifications]);

        return notification;
    }

    /**
     * Mark notification(s) as read
     */
    markAsRead(notificationId: string): void {
        const notifications = this.notificationsSubject.value;
        const updated = notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        );
        this.notificationsSubject.next(updated);
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): void {
        const notifications = this.notificationsSubject.value;
        const updated = notifications.map(n => ({ ...n, read: true }));
        this.notificationsSubject.next(updated);
    }

    /**
     * Delete a notification
     */
    delete(notificationId: string): void {
        const notifications = this.notificationsSubject.value;
        const filtered = notifications.filter(n => n.id !== notificationId);
        this.notificationsSubject.next(filtered);
    }

    /**
     * Clear all notifications
     */
    clearAll(): void {
        this.notificationsSubject.next([]);
    }

    /**
     * Get unread count
     */
    getUnreadCount(): Observable<number> {
        return new Observable(observer => {
            this.notifications$.subscribe(notifications => {
                const unreadCount = notifications.filter(n => !n.read).length;
                observer.next(unreadCount);
            });
        });
    }

    // Notification Helpers for specific events

    notifyReviewTaskCreated(workOrderNumber: string, supervisorName: string): void {
        this.create(
            'info',
            'New Review Task',
            `Review required for Work Order ${workOrderNumber}`,
            {
                actionUrl: '/reviews',
                actionLabel: 'View Reviews'
            }
        );
    }

    notifyReviewDueSoon(workOrderNumber: string, hoursRemaining: number): void {
        this.create(
            'warning',
            'Review Due Soon',
            `Review for WO ${workOrderNumber} due in ${hoursRemaining} hours`,
            {
                actionUrl: '/reviews',
                actionLabel: 'Review Now'
            }
        );
    }

    notifyReviewOverdue(workOrderNumber: string): void {
        this.create(
            'error',
            'Review Overdue',
            `Review for Work Order ${workOrderNumber} is overdue`,
            {
                actionUrl: '/reviews',
                actionLabel: 'Review Now'
            }
        );
    }

    notifyReviewSubmitted(workOrderNumber: string, outcome: string): void {
        this.create(
            'success',
            'Review Submitted',
            `Review for WO ${workOrderNumber} completed with outcome: ${outcome}`,
            {
                actionUrl: '/orders',
                actionLabel: 'View Orders'
            }
        );
    }

    notifyFollowUpCreated(originalWoNumber: string, newWoNumber: string): void {
        this.create(
            'warning',
            'Follow-Up Order Created',
            `Follow-up order ${newWoNumber} created for ${originalWoNumber}`,
            {
                actionUrl: '/orders',
                actionLabel: 'View Order'
            }
        );
    }

    private generateId(): string {
        return `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
