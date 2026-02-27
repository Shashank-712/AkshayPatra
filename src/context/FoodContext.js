import React, { createContext, useContext, useState } from 'react';

const FoodContext = createContext();

export const useFood = () => {
  return useContext(FoodContext);
};

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);

  const addFood = (foodData) => {
    const newFood = {
      id: Date.now(),
      status: 'Available',
      createdAt: new Date(),
      ...foodData,
    };

    setFoods((prev) => [...prev, newFood]);
  };

  return (
    <FoodContext.Provider value={{ foods, addFood }}>
      {children}
    </FoodContext.Provider>
  );
};