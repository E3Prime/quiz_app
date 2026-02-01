const retrievePassages = async () => {
  try {
    const response = await fetch("src/data.json");
    const data = response.json();
    return data;
  } catch (e) {
    console.error("There was a problem fetching passages", e);
  }
};

const passages = await retrievePassages();

const {easy, medium, hard} = passages;
console.log(easy);
