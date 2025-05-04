//Initial References
const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const newGameButton = document.getElementById("new-game-button");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");
const hintButton = document.getElementById("hint-button");
const hintText = document.getElementById("hint-text");

//Options values for buttons
let options = {
    disease: [
        {word: "Lupus", hint: "Autoimmune disease affecting skin and internal organs"},
        {word: "Psoriasis", hint: "Inflammatory skin disease characterized by red patches and scales"},
        {word: "Vitiligo", hint: "Skin disorder causing loss of pigmentation"},
        {word: "Scleroderma", hint: "Connective tissue disease that hardens the skin"},
        {word: "Coeliacdisease", hint: "Autoimmune disease triggered by gluten ingestion"},
        {word: "HashimotoThyroiditis", hint: "Chronic autoimmune inflammation of the thyroid"}
    ],
    Hormone: [
        {word: "Cortisol", hint: "Stress hormone produced by adrenal glands"},
        {word: "Glucagon", hint: "Pancreatic hormone that increases blood sugar"},
        {word: "Calcitonin", hint: "Hormone that regulates blood calcium levels"},
        {word: "Insulin", hint: "Pancreatic hormone that regulates blood glucose"},
        {word: "Dopamine", hint: "Neurotransmitter associated with pleasure and motivation"},
        {word: "Adrenaline", hint: "Hormone secreted in response to stress or danger"},
        {word: "Testosterone", hint: "Primary male sex hormone"},
        {word: "Melatonin", hint: "Hormone regulating sleep-wake cycle"}
    ],
    immunological_technics: [
        {word: "ELISA", hint: "Immunoassay technique used to detect antibodies or antigens"},
        {word: "Flowcytometry", hint: "Technique for analyzing physical and chemical characteristics of cells"},
        {word: "Westernblot", hint: "Method for detecting specific proteins in a sample"},
        {word: "Immunoprecipitation", hint: "Technique to isolate an antigen using a specific antibody"},
        {word: "iPCR", hint: "Technique combining immunology and PCR amplification"}
    ],
};

//count
let winCount = 0;
let count = 0;

let chosenWord = "";
let currentHint = "";

//Display option buttons
const displayOptions = () => {
  optionsContainer.innerHTML += `<h3>Please Select An Option</h3>`;
  let buttonCon = document.createElement("div");
  for (let value in options) {
    buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`;
  }
  optionsContainer.appendChild(buttonCon);
};

//Block all the Buttons
const blocker = () => {
  let optionsButtons = document.querySelectorAll(".options");
  let letterButtons = document.querySelectorAll(".letters");
  //disable all options
  optionsButtons.forEach((button) => {
    button.disabled = true;
  });

  //disable all letters
  letterButtons.forEach((button) => {
    button.disabled = true;
  });
  newGameContainer.classList.remove("hide");
};

//Word Generator
const generateWord = (optionValue) => {
  let optionsButtons = document.querySelectorAll(".options");
  //If optionValur matches the button innerText then highlight the button
  optionsButtons.forEach((button) => {
    if (button.innerText.toLowerCase() === optionValue) {
      button.classList.add("active");
    }
    button.disabled = true;
  });

  //initially hide letters, clear previous word
  letterContainer.classList.remove("hide");
  userInputSection.innerText = "";

  let optionArray = options[optionValue];
  //choose random word object
  let randomIndex = Math.floor(Math.random() * optionArray.length);
  let chosenWordObj = optionArray[randomIndex];
  
  chosenWord = chosenWordObj.word.toUpperCase();
  currentHint = chosenWordObj.hint;

  // Show hint button
  hintButton.classList.remove("hide");
  // Clear previous hint
  hintText.innerText = "";
  hintText.classList.add("hide");

  //replace every letter with span containing dash
  let displayItem = chosenWord.replace(/./g, '<span class="dashes">_</span>');

  //Display each element as span
  userInputSection.innerHTML = displayItem;
};

// Display hint function
const showHint = () => {
  hintText.innerText = currentHint;
  hintText.classList.remove("hide");
};

//Initial Function (Called when page loads/user presses new game)
const initializer = () => {
  winCount = 0;
  count = 0;

  //Initially erase all content and hide letteres and new game button
  userInputSection.innerHTML = "";
  optionsContainer.innerHTML = "";
  letterContainer.classList.add("hide");
  newGameContainer.classList.add("hide");
  letterContainer.innerHTML = "";
  hintText.innerText = "";
  hintText.classList.add("hide");
  hintButton.classList.add("hide");

  //For creating letter buttons
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");
    button.classList.add("letters");
    //Number to ASCII[A-Z]
    button.innerText = String.fromCharCode(i);
    //character button click
    button.addEventListener("click", () => {
      let charArray = chosenWord.split("");
      let dashes = document.getElementsByClassName("dashes");
      //if array contains clciked value replace the matched dash with letter else dram on canvas
      if (charArray.includes(button.innerText)) {
        charArray.forEach((char, index) => {
          //if character in array is same as clicked button
          if (char === button.innerText) {
            //replace dash with letter
            dashes[index].innerText = char;
            //increment counter
            winCount += 1;
            //if winCount equals word lenfth
            if (winCount == charArray.length) {
              resultText.innerHTML = `<h2 class='win-msg'>You Win!!</h2><p>The word was <span>${chosenWord}</span></p>`;
              //block all buttons
              blocker();
            }
          }
        });
      } else {
        //lose count
        count += 1;
        //for drawing man
        drawMan(count);
        //Count==6 because head,body,left arm, right arm,left leg,right leg
        if (count == 6) {
          resultText.innerHTML = `<h2 class='lose-msg'>You Lose!!</h2><p>The word was <span>${chosenWord}</span></p>`;
          blocker();
        }
      }
      //disable clicked button
      button.disabled = true;
    });
    letterContainer.append(button);
  }

  displayOptions();
  //Call to canvasCreator (for clearing previous canvas and creating initial canvas)
  let { initialDrawing } = canvasCreator();
  //initialDrawing would draw the frame
  initialDrawing();
};

//Canvas
const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;

  //For drawing lines
  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  };

  const head = () => {
    context.beginPath();
    context.arc(70, 30, 10, 0, Math.PI * 2, true);
    context.stroke();
  };

  const body = () => {
    drawLine(70, 40, 70, 80);
  };

  const leftArm = () => {
    drawLine(70, 50, 50, 70);
  };

  const rightArm = () => {
    drawLine(70, 50, 90, 70);
  };

  const leftLeg = () => {
    drawLine(70, 80, 50, 110);
  };

  const rightLeg = () => {
    drawLine(70, 80, 90, 110);
  };

  //initial frame
  const initialDrawing = () => {
    //clear canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //bottom line
    drawLine(10, 130, 130, 130);
    //left line
    drawLine(10, 10, 10, 131);
    //top line
    drawLine(10, 10, 70, 10);
    //small top line
    drawLine(70, 10, 70, 20);
  };

  return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

//draw the man
const drawMan = (count) => {
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
  switch (count) {
    case 1:
      head();
      break;
    case 2:
      body();
      break;
    case 3:
      leftArm();
      break;
    case 4:
      rightArm();
      break;
    case 5:
      leftLeg();
      break;
    case 6:
      rightLeg();
      break;
    default:
      break;
  }
};

//New Game
newGameButton.addEventListener("click", initializer);
// Add hint button event listener
hintButton.addEventListener("click", showHint);
window.onload = initializer;