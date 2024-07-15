const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const path = require('path');


// Mock database
let trashItems = [
    { name: 'plastic', imageUrl: 'data/plastic.png', binTypes: 'yellow' },
    { name: 'carton', imageUrl: 'data/carton.png', binTypes: 'blue' },
    { name: 'battery', imageUrl: 'data/battery.jpeg', binTypes:'red'},
    { name: 'food', imageUrl: 'data/food.jpg', binTypes: 'green'},
    { name: 'paper', imageUrl: 'data/paper.jpg', binTypes: 'blue'},
  
];

let binItems = [
  { name: 'blue', imageUrl: 'data/bluebin.jpg'},
  { name: 'red', imageUrl: 'data/redbin.jpg'},
  { name: 'green', imageUrl: 'data/greenbin.jpg'},
  { name: 'yellow', imageUrl: 'data/yellowbin.jpg'},
]

app.use(cors()); 
app.use(express.static(path.join(__dirname,'client')));
app.use('/data', express.static(path.join(__dirname, 'data')));
//app.use(express.static(path.join(__dirname,'data')));

// Helper function to get unique random indices
function getUniqueRandomIndices(max, count) {
  const indices = [];
  while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
      }
  }
  return indices;
}

// API endpoint to fetch a random trash item
app.get('/random-trash-item', (req, res) => {
  const randomIndex = getUniqueRandomIndices(trashItems.length,1)[0];
  const trashItem = trashItems[randomIndex];

  //get the correct bin item for the trash item
  const correctBinItem = binItems.find(bin => bin.name === trashItem.binTypes);

  //get a random bin item that is not the correct bin item for the trash item
  const otherBinIndices = getUniqueRandomIndices(
    binItems.filter(bin => bin.name !== trashItem.binTypes).length, 1);
  const otherBinItem = binItems.filter(bin=> bin.name !== trashItem.binTypes)[otherBinIndices[0]];
  const binItem = [correctBinItem, otherBinItem];
  res.json({trashItem, binItem});
  console.log("fetched succesfully: ", {trashItem, binItem});
});

app.get('/', (req, res) => {
  res.send('Welcome to the Trash Sorting API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


