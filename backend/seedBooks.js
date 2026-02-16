import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import Book from "./models/book.js"; // make sure filename case matches

dotenv.config();

const categories = [ "B.Tech - Computer Science",
  "B.Tech - Mechanical",
  "B.Tech - Civil",
  "B.Tech - Electrical",
  "NCERT Class 10 - CBSE",
  "NCERT Class 11 - CBSE",
  "NCERT Class 12 - CBSE",
  "Religious - Hinduism",
  "Religious - Islam",
  "Religious - Christianity",
  "Religious - Buddhism"
];

const generateUniqueISBN = (usedIsbns) => {
  let isbn;
  do {
    isbn = faker.string.numeric(13);
  } while (usedIsbns.has(isbn));
  usedIsbns.add(isbn);
  return isbn;
};

const generateBooks = (count = 0) => {
  const books = [];
  const usedIsbns = new Set();

  for (let i = 0; i < count; i++) {
    const total = faker.number.int({ min: 5, max: 30 });

    books.push({
      title: faker.commerce.productName() + " " + faker.word.adjective(),
      author: faker.person.fullName(),
      isbn: generateUniqueISBN(usedIsbns),
      category: faker.helpers.arrayElement(categories),
      totalCopies: total,
      availableCopies: faker.number.int({ min: 0, max: total }),
      createdAt: faker.date.past()
    });
  }

  return books;
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Book.deleteMany();
    console.log("🗑 Old books removed");

    const books = generateBooks(0);

    await Book.insertMany(books);

    console.log("🚀 Books Inserted Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeder Error:", error);
    process.exit(1);
  }
};

seedDB();
