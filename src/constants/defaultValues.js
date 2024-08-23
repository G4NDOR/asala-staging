// src/constants/defaultValues.js

const DEFAULT_VALUES = {
    PRODUCT:   {
        id: 1,
        name: "Product",
        price: 1.00,
        status: "present",
        description: "",
        
        fullDescription: "",
        image:
          "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
        images: [
        "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
        ],
        fullImages: [
          "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
        ],
        wishes: 0,
        available: false,
        producer: "Asala",
        producerImage: "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
        availableTime: "",//"Mo,Tu,We,Th,Fr 8-5",
        quantity: 0,
        discount: 0,
      },
    PRODUCTS: [
        {
          id: 1,
          name: "Product 1",
          price: 10.3,
          status: "present",
          description: " little short description...",
          
          fullDescription: `I want to make a product page, where if you click on a product you get redirected to this page, I want you to give me a ProductPage.js and a ProductPage.css files knowing that:
      I want the page to be simple and nice looking with good design, clean, not too much stuff. also responsive and conveniant for mobile phones, I want it to have a bar on top where it prompts for an adress (that's the adress that the order will be delivered to), maybe if you include a prompt in the search bar that fades when costumer start typing would be nice, make sure to make it ask for precice adress, and have a little field (for any notes or requests or description ) that pops up when costumer have selected an adress. make sure the search bar for adress, lets costumer type in an adress and shows suggestion for it, so that the costumer have to choose from the list, the final adress is an option from the list not what the costumer writes. after that, I want it to be thin not taking too much space, just like a bar on top, and the description field that pops up under it. then have a big image slider, taking up the screen's width, with some arrows for costumers to go through pictures. after that I want the ame of the product maybe under the image slider to the left with nice big font, that is also responsive. after that a small image in   a circle with a name under it for the producer, this line should be under the product name. after that I want to have under that a description, where there's more detail about the product, description taking up screen width, if it's too long, show some and hide the rest,  have a little arrow that suggest to read more if you click it. so that if you click it you have a nice little animation where the where the description expands vertically, make sure you have the option to collapse it back. make sure everything is layed out in a nice way, responsive and friendly to the costumer. evrythingis easy to figure out. without confusing the costumer. `,
          image:
            "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
          images: [
          "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
          "https://www.eatright.org/-/media/images/eatright-landing-pages/foodgroupslp_804x482.jpg?as=0&w=967&rev=d0d1ce321d944bbe82024fff81c938e7&hash=E6474C8EFC5BE5F0DA9C32D4A797D10D",
          ],
          fullImages: [
            "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
            "https://www.eatright.org/-/media/images/eatright-landing-pages/foodgroupslp_804x482.jpg?as=0&w=967&rev=d0d1ce321d944bbe82024fff81c938e7&hash=E6474C8EFC5BE5F0DA9C32D4A797D10D",
          ],
          wishes: 500,
          available: true,
          producer: "Asala",
          producerImage: "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
          availableTime: "Mo,Tu,We,Th,Fr 8-5",
          quantity: 4,
          discount: 10,
        },
        {
          id: 2,
          name: "Product 2",
          price: 20.0,
          status: "future",
          description: " little short description...",
          
          fullDescription: `I want to make a product page, where if you click on a product you get redirected to this page, I want you to give me a ProductPage.js and a ProductPage.css files knowing that:
      I want the page to be simple and nice looking with good design, clean, not too much stuff. also responsive and conveniant for mobile phones, I want it to have a bar on top where it prompts for an adress (that's the adress that the order will be delivered to), maybe if you include a prompt in the search bar that fades when costumer start typing would be nice, make sure to make it ask for precice adress, and have a little field (for any notes or requests or description ) that pops up when costumer have selected an adress. make sure the search bar for adress, lets costumer type in an adress and shows suggestion for it, so that the costumer have to choose from the list, the final adress is an option from the list not what the costumer writes. after that, I want it to be thin not taking too much space, just like a bar on top, and the description field that pops up under it. then have a big image slider, taking up the screen's width, with some arrows for costumers to go through pictures. after that I want the ame of the product maybe under the image slider to the left with nice big font, that is also responsive. after that a small image in   a circle with a name under it for the producer, this line should be under the product name. after that I want to have under that a description, where there's more detail about the product, description taking up screen width, if it's too long, show some and hide the rest,  have a little arrow that suggest to read more if you click it. so that if you click it you have a nice little animation where the where the description expands vertically, make sure you have the option to collapse it back. make sure everything is layed out in a nice way, responsive and friendly to the costumer. evrythingis easy to figure out. without confusing the costumer. `,
          image:
            "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
          images: [
          "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
          "https://www.eatright.org/-/media/images/eatright-landing-pages/foodgroupslp_804x482.jpg?as=0&w=967&rev=d0d1ce321d944bbe82024fff81c938e7&hash=E6474C8EFC5BE5F0DA9C32D4A797D10D",
          ],
          fullImages: [
            "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
            "https://www.eatright.org/-/media/images/eatright-landing-pages/foodgroupslp_804x482.jpg?as=0&w=967&rev=d0d1ce321d944bbe82024fff81c938e7&hash=E6474C8EFC5BE5F0DA9C32D4A797D10D",
          ],
          wishes: 700,
          available: true,
          producer: "Asala",
          producerImage: "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
          availableTime: "Mo,Tu,We,Th,Fr 8-5",
          quantity: 5,
          discount: 0,
        },
        {
          id: 3,
          name: "Product 3",
          price: 30.0,
          status: "future",
          description: " little short description...",
          
          fullDescription: `I want to make a product page, where if you click on a product you get redirected to this page, I want you to give me a ProductPage.js and a ProductPage.css files knowing that:
      I want the page to be simple and nice looking with good design, clean, not too much stuff. also responsive and conveniant for mobile phones, I want it to have a bar on top where it prompts for an adress (that's the adress that the order will be delivered to), maybe if you include a prompt in the search bar that fades when costumer start typing would be nice, make sure to make it ask for precice adress, and have a little field (for any notes or requests or description ) that pops up when costumer have selected an adress. make sure the search bar for adress, lets costumer type in an adress and shows suggestion for it, so that the costumer have to choose from the list, the final adress is an option from the list not what the costumer writes. after that, I want it to be thin not taking too much space, just like a bar on top, and the description field that pops up under it. then have a big image slider, taking up the screen's width, with some arrows for costumers to go through pictures. after that I want the ame of the product maybe under the image slider to the left with nice big font, that is also responsive. after that a small image in   a circle with a name under it for the producer, this line should be under the product name. after that I want to have under that a description, where there's more detail about the product, description taking up screen width, if it's too long, show some and hide the rest,  have a little arrow that suggest to read more if you click it. so that if you click it you have a nice little animation where the where the description expands vertically, make sure you have the option to collapse it back. make sure everything is layed out in a nice way, responsive and friendly to the costumer. evrythingis easy to figure out. without confusing the costumer. `,
          image:
            "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
          images: [
          "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
          "https://www.eatright.org/-/media/images/eatright-landing-pages/foodgroupslp_804x482.jpg?as=0&w=967&rev=d0d1ce321d944bbe82024fff81c938e7&hash=E6474C8EFC5BE5F0DA9C32D4A797D10D",
          ],
          fullImages: [
            "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
            "https://www.eatright.org/-/media/images/eatright-landing-pages/foodgroupslp_804x482.jpg?as=0&w=967&rev=d0d1ce321d944bbe82024fff81c938e7&hash=E6474C8EFC5BE5F0DA9C32D4A797D10D",
          ],
          wishes: 50,
          available: true,
          producer: "Asala",
          producerImage: "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
          availableTime: "Mo,Tu,We,Th,Fr 8-5",
          quantity: 15,
          discount: 50,
        },
      ]
  };
  
  export default DEFAULT_VALUES;