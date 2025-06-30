const candyData = [
    { name: 'Gummy Bears', image: 'https://img.freepik.com/free-vector/gummy-bears-cartoon-style_1308-114543.jpg' },
    { name: 'Lollipops', image: 'https://img.freepik.com/free-vector/lollipops-cartoon-style_1308-114540.jpg' },
    { name: 'Chocolates', image: 'https://img.freepik.com/free-vector/chocolate-bar-cartoon-style_1308-114541.jpg' },
    { name: 'Jelly Beans', image: 'https://img.freepik.com/free-vector/jelly-beans-cartoon-style_1308-114542.jpg' },
    { name: 'Cotton Candy', image: 'https://img.freepik.com/free-vector/cotton-candy-cartoon-style_1308-114539.jpg' },
    { name: 'Hard Candies', image: 'https://img.freepik.com/free-vector/hard-candies-cartoon-style_1308-114544.jpg' },
];

const candyShowcase = document.querySelector('.candy-showcase');

candyData.forEach(candy => {
    const candyItem = document.createElement('div');
    candyItem.classList.add('candy-item');

    const candyImage = document.createElement('img');
    candyImage.src = candy.image;
    candyImage.alt = candy.name;

    const candyName = document.createElement('h3');
    candyName.textContent = candy.name;

    candyItem.appendChild(candyImage);
    candyItem.appendChild(candyName);

    candyShowcase.appendChild(candyItem);
});