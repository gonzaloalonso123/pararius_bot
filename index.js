const { performActions } = require("./scraper");

//adjust filters in this URL ( go to Pararius, put filters, copy URL)
const url = "https://www.pararius.com/pisos/utrecht/apartamento-piso/0-1300"


//put here the data you will introduce for every house
const house_data = (city) => ({
  first_name: "",
  last_name: "",
  salutation: "Madam",
  phone: "",
  //ddmmyyyy
  birth_date: "01012000",
  message: ``,
});

const oneHouseActionsPararius = [
  {
    type: "wait",
  },
  {
    type: "click",
    selector: "className",
    className: "listing-reaction-button listing-reaction-button--contact-agent",
  },
  {
    type: "wait",
  },
    // {
    //   type: "input",
    //   text: house_data("Utrecht").message,
    //   selector: "location",
    //   location: [557, 295],
    // },
    // {
    //   type: "selectOption",
    //   selector: "location",
    //   optionText: house_data("Utrecht").salutation,
    //   location: [425, 508],
    // },
    // {
    //   type: "input",
    //   text: house_data("Utrecht").first_name,
    //   selector: "location",
    //   location: [405, 560],
    // },
    // {
    //   type: "input",
    //   text: house_data("Utrecht").last_name,
    //   selector: "location",
    //   location: [399, 632],
    // },
    // {
    //   type: "input",
    //   text: house_data("Utrecht").phone,
    //   selector: "location",
    //   location: [398, 711],
    // },
    // {
    //   type: "scroll",
    //   scrollBy: 200,
    // },
    // {
    //   type: "input",
    //   text: house_data("Utrecht").birth_date,
    //   selector: "location",
    //   location: [391, 550],
    // },
  { type: "wait" },
  {
    type: "click",
    xpath: "/html/body/div[3]/div/div[1]/form/div[2]/button",
  },
  {
    type: "navigate",
    url: url,
  },
  {
    type: "wait",
  },
  {
    type: "wait",
  },
];

const pararius = async () => {
  const process = {
    url: url,
    actions: [
      {
        xpath: "/html/body/div[3]/div/wc-masthead/header/nav/a",
        type: "click",
      },
      {
        type: "wait",
      },
      {
        type: "click",
        xpath: '//*[@id="onetrust-accept-btn-handler"]',
      },
      {
        xpath: "/html/body/div[3]/div/div/div/a[3]",
        type: "click",
      },
      {
        type: "wait",
      },
      {
        type: "input",
		//your email
        text: "",
        selector: "location",
        location: [765, 253],
      },
      {
        type: "input",
		//your password
        text: "",
        selector: "location",
        location: [638, 325],
      },
      {
        type: "click",
        selector: "location",
        location: [669, 408],
      },
      {
        type: "wait",
      },
      {
        type: "navigate",
        url: url,
      },
      {
        type: "wait",
      },
      {
        type: "iterate_list",
        xpath: "/html/body/div[4]/div[3]/div[4]/div/ul",
        className: "listing-search-item__title",
        actions: oneHouseActionsPararius,
        idSelector:
          "listing-search-item__link listing-search-item__link--title",
      },
    ],
  };

  performActions(process.actions, process.url);
};

pararius();
