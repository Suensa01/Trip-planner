import React from 'react';
import Card from './Card';

const Cards = () => {
  const cards = [
    {
      title: 'Card 1',
      content: [
        { text: 'Item 1', href: '/item1' },
        { text: 'Item 2', href: '/item2' },
        { text: 'Item 3', href: '/item3' },
        { text: 'Item 4', href: '/item4' },
        { text: 'Item 5', href: '/item5' },
      ],
      color: 'red',
    },
    {
      title: 'Card 2',
      content: [
        { text: 'Item 1', href: '/item1' },
        { text: 'Item 2', href: '/item2' },
        { text: 'Item 3', href: '/item3' },
        { text: 'Item 4', href: '/item4' },
        { text: 'Item 5', href: '/item5' },
      ],
      color: 'blue',
    },
    {
      title: 'Card 3',
      content: [
        { text: 'Item 1', href: '/item1' },
        { text: 'Item 2', href: '/item2' },
        { text: 'Item 3', href: '/item3' },
        { text: 'Item 4', href: '/item4' },
        { text: 'Item 5', href: '/item5' },
      ],
      color: 'green',
    },
    {
      title: 'Card 4',
      content: [
        { text: 'Item 1', href: '/item1' },
        { text: 'Item 2', href: '/item2' },
        { text: 'Item 3', href: '/item3' },
        { text: 'Item 4', href: '/item4' },
        { text: 'Item 5', href: '/item5' },
      ],
      color: 'yellow',
    },
    {
      title: 'Card 5',
      content: [
        { text: 'Item 1', href: '/item1' },
        { text: 'Item 2', href: '/item2' },
        { text: 'Item 3', href: '/item3' },
        { text: 'Item 4', href: '/item4' },
        { text: 'Item 5', href: '/item5' },
      ],
      color: 'purple',
    },
    {
      title: 'Card 6',
      content: [
        { text: 'Item 1', href: '/item1' },
        { text: 'Item 2', href: '/item2' },
        { text: 'Item 3', href: '/item3' },
        { text: 'Item 4', href: '/item4' },
        { text: 'Item 5', href: '/item5' },
      ],
      color: 'pink',
    },
    {
      title: 'Card 7',
      content: [
        { text: 'Item 1', href: '/item1' },
        { text: 'Item 2', href: '/item2' },
        { text: 'Item 3', href: '/item3' },
        { text: 'Item 4', href: '/item4' },
        { text: 'Item 5', href: '/item5' },
      ],
      color: 'orange',
    },
    {
      title: 'Card 8',
      content: [
        { text: 'Item 1', href: '/item1' },
        { text: 'Item 2', href: '/item2' },
        { text: 'Item 3', href: '/item3' },
        { text: 'Item 4', href: '/item4' },
        { text: 'Item 5', href: '/item5' },
      ],
      color: 'brown',
    },
    {
      title: 'Card 9',
      content: [
        { text: 'Item 1', href: '/item1' },
        { text: 'Item 2', href: '/item2' },
        { text: 'Item 3', href: '/item3' },
        { text: 'Item 4', href: '/item4' },
        { text: 'Item 5', href: '/item5' },
      ],
      color: 'gray',
    },
  ];

  return (
    <div className="cards">
      {cards.map((card, index) => (
        <Card key={index} title={card.title} content={card.content} color={card.color} />
      ))}
    </div>
  );
};

export default Cards;