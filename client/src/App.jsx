import React from "react";

const App = () => {
  return (
    <div>
      <form action="http://localhost:5000/create-account" method="POST">
        <button type="submit">Checkout</button>
      </form>

      <form action="http://localhost:5000/pay" method="POST">
        <button type="submit">Pay</button>
      </form>
      <form action="http://localhost:5000/delete" method="DELETE">
        <button type="submit">Delete account</button>
      </form>
    </div>
  );
};

export default App;
