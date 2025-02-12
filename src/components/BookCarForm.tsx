import axios from 'axios'; // Import axios

const BookCarForm = ({ carId }: { carId: string }) => {
  const handleBooking = async () => {
    try {
      const response = await axios.post('/api/bookings', { carId });
      console.log('Booking successful:', response.data);
    } catch (error) {
      console.error('Failed to book car:', error);
    }
  };

  return (
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded"
      onClick={handleBooking}
    >
      Book Now
    </button>
  );
};

export default BookCarForm;
