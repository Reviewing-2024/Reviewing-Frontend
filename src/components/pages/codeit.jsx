import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setError(null);
      setItems(null);
      setLoading(true);
      const response = await axios.get(
        'http://localhost:8080/topics'
      );
      setItems(response.data);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  console.log(items);

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;

  if (!items) return null;

  return (
      <>
       <ul>
         {items.map(items => (
           <li key={items.id}>
             {items.title}
           </li>
         ))}
       </ul>
         // button을 클릭하면 API를 다시 불러와줍니다.
         <button onClick={ fetchUsers }>다시 불러오기</button>
      </>
  );
}

export default Users;