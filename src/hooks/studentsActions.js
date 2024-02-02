export const toggleReservationStatus = (student, reservationId, newStatus) => ({
    type: 'TOGGLE_STATUS',
    payload: { student, reservationId, newStatus },
  });