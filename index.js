// index.js

module.exports = (req, res) => {
  try {
    const name = req.query.name || "World"; // Get the 'name' query parameter from the request or default to 'World'
    const greeting = `Hello, ${name}!`; // Compose the greeting message
    res.status(200).send(greeting); // Send the greeting message as a response
  } catch (error) {
    console.error("Error occurred:", error); // Log any errors that occur
    res.status(500).send("Internal Server Error"); // Send a generic error response
  }
};
