import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassSessions } from "../../redux/features/classSession/classSessionSlice";

const localizer = momentLocalizer(moment);

const ClassSessionCalendar = () => {
  const dispatch = useDispatch();
  const { sessions = [], loading } = useSelector((state) => state.classSession); // Updated state structure
  const [events, setEvents] = useState([]);

  useEffect(() => {
    dispatch(fetchClassSessions()); // Fetch sessions
  }, [dispatch]);

  useEffect(() => {
    // Map sessions to calendar events
    const mappedEvents = sessions.map((session) => ({
      id: session._id,
      title: `${session.classType} - ${session.status}`,
      start: new Date(session.startDate),
      end: new Date(session.endDate),
      allDay: session.sessionType === "Single",
      resource: session,
    }));
    setEvents(mappedEvents);
  }, [sessions]);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Class Session Calendar</h1>
      {loading ? (
        <p>Loading sessions...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectEvent={(event) => alert(`Class: ${event.title}`)}
          onSelectSlot={(slotInfo) => alert(`Selected slot from ${slotInfo.start} to ${slotInfo.end}`)}
        />
      )}
    </div>
  );
};

export default ClassSessionCalendar;
