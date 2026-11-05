import type { Reservation } from '../../types';
import { dayUseLabel } from '../../utils/reservationStay';

export default function StayTypeBadge({ reservation }: { reservation: Reservation }) {
    if (reservation.stayType !== 'day_use') return null;
    return (
        <span className="inline-block max-w-full rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
            {dayUseLabel(reservation)}
        </span>
    );
}
