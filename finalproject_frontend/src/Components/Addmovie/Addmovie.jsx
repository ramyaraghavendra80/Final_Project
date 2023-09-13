import React, { useState } from "react";

function AddMovie() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState("");
  const [director, setDirector] = useState("");
  const [length, setLength] = useState("");
  const [language, setLanguage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("year", year);
    formData.append("director", director);
    formData.append("length", length);
    formData.append("language", language);
    formData.append("image", image);

    try {
      const response = await fetch("https://api.example.com/movies", {
        method: "POST",
        body: formData, // Use the FormData object
      });

      if (response.ok) {
        alert("Movie added successfully");
        // Clear the form after successful submission
        setTitle("");
        setGenre("");
        setYear("");
        setImage("");
        setDirector("");
        setLength("");
        setLanguage("");
      } else {
        console.error("Failed to add movie");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <div>
      <h2>Add a Movie</h2>
      <form action="/upload" method="post" enctype="multipart/form-data" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Director"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
        />
        <input
          type="text"
          placeholder="Movie Length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />
        <input
          type="text"
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
}

export default AddMovie;
