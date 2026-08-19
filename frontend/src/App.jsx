import { useEffect, useState } from 'react';
import { api } from './api';
import Dashboard from './Dashboard';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';

export default function App() {
  const [tab, setTab] = useState('catalog');
  const [catalog, setCatalog] = useState([]);
  const [error, setError] = useState(null);

  const [page, setPage] = useState('login');

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const [bookingLoading, setBookingLoading] = useState(null);
  const [bookingMessage, setBookingMessage] = useState(null);

  useEffect(() => {
    if (tab === 'catalog') {
      setError(null);

      api.catalog()
        .then(setCatalog)
        .catch((err) => setError(err.message));
    }
  }, [tab]);

  function handleRegistered(newUser) {
    setUser(newUser);
    setPage('login');
  }

  function handleLoggedIn(loggedUser) {
    setUser(loggedUser);
    setPage('catalog');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
    setPage('login');
  }

  async function handleBook(eventId) {
  console.log("BOOK DEBUG - user:", user);
  console.log("BOOK DEBUG - userId:", user?.id);
  console.log("BOOK DEBUG - eventId:", eventId);

  if (!user?.id) {
    setBookingMessage({
      type: 'error',
      text: 'User ID is missing. Please logout and login again.',
    });
    return;
  }

  setBookingLoading(eventId);
  setBookingMessage(null);

  try {
    const booking = await api.book(String(user.id), Number(eventId));

    console.log("BOOKING RESPONSE:", booking);

    setBookingMessage({
      type: 'success',
      text: `Booking successful! Booking ID: ${booking.id}`,
    });
  } catch (err) {
    console.error("BOOKING ERROR:", err);

    setBookingMessage({
      type: 'error',
      text: `Booking failed: ${err.message}`,
    });
  } finally {
    setBookingLoading(null);
  }
}

  if (page === 'register') {
    return (
      <Register
        onLogin={() => setPage('login')}
        onRegistered={handleRegistered}
      />
    );
  }

  if (page === 'login') {
    return (
      <Login
        onRegister={() => setPage('register')}
        onLoggedIn={handleLoggedIn}
      />
    );
  }

  if (page === 'profile') {
    return (
      <Profile
        user={user}
        onBack={() => setPage('catalog')}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>

      {/* Header */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '10px 0',
        }}
      >
        {/* EventHub - Center */}
        <strong
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#042874',
            fontSize: '28px',
            fontWeight: 'bold',
          }}
        >
          EventHub
        </strong>

        {/* Right side */}
        <div>
          <span style={{ marginRight: '10px' }}>
            {user?.email}
          </span>

          <button
            onClick={() => setPage('profile')}
            style={{
              backgroundColor: '#042874',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
              borderRadius: '5px',
            }}
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#042874',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
              borderRadius: '5px',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ marginBottom: '1rem' }}>

        <button
          onClick={() => setTab('catalog')}
          disabled={tab === 'catalog'}
          style={{
            backgroundColor: '#042874',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
            borderRadius: '5px',
          }}
        >
          Catalog
        </button>

        <button
          onClick={() => setTab('dashboard')}
          disabled={tab === 'dashboard'}
          style={{
            backgroundColor: '#042874',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
            borderRadius: '5px',
          }}
        >
          Dashboard
        </button>

      </div>

      {/* Booking Message */}
      {bookingMessage && (
        <div
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            padding: '15px',
            borderRadius: '5px',
            backgroundColor:
              bookingMessage.type === 'success'
                ? '#d4edda'
                : '#f8d7da',
            color:
              bookingMessage.type === 'success'
                ? '#155724'
                : '#721c24',
            border:
              bookingMessage.type === 'success'
                ? '1px solid #c3e6cb'
                : '1px solid #f5c6cb',
          }}
        >
          {bookingMessage.text}
        </div>
      )}

      {/* Catalog */}
      {tab === 'catalog' && (
        <div>

          {error && (
            <p style={{ color: 'crimson' }}>
              Failed to load catalog: {error}
            </p>
          )}

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '2rem',
            }}
          >
            <thead>
              <tr>

                <th
                  style={{
                    textAlign: 'left',
                    padding: '20px',
                    borderBottom: '2px solid #042874',
                    backgroundColor: '#4968aa',
                  }}
                >
                  ID
                </th>

                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderBottom: '2px solid #042874',
                    backgroundColor: '#4968aa',
                  }}
                >
                  Event
                </th>

                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderBottom: '2px solid #042874',
                    backgroundColor: '#4968aa',
                  }}
                >
                  Price
                </th>

                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderBottom: '2px solid #042874',
                    backgroundColor: '#4968aa',
                  }}
                >
                  Action
                </th>

              </tr>
            </thead>

            <tbody>
              {catalog.map((event) => (
                <tr key={event.id}>

                  <td
                    style={{
                      padding: '20px',
                      borderBottom: '1px solid #042874',
                      backgroundColor: '#9daed0',
                    }}
                  >
                    {event.id}
                  </td>

                  <td
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #042874',
                      backgroundColor: '#9daed0',
                    }}
                  >
                    {event.title}
                  </td>

                  <td
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #042874',
                      backgroundColor: '#9daed0',
                    }}
                  >
                    ${event.price}
                  </td>

                  <td
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #042874',
                      backgroundColor: '#9daed0',
                    }}
                  >
                    <button
                      onClick={() => handleBook(event.id)}
                      disabled={bookingLoading === event.id}
                      style={{
                        backgroundColor:
                          bookingLoading === event.id
                            ? '#777'
                            : '#042874',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor:
                          bookingLoading === event.id
                            ? 'not-allowed'
                            : 'pointer',
                      }}
                    >
                      {bookingLoading === event.id
                        ? 'Booking...'
                        : 'Book'}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

      {/* Dashboard */}
      {tab === 'dashboard' && <Dashboard />}

    </div>
  );
}