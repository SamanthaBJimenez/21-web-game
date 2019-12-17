document.addEventListener("DOMContentLoaded", () => {
    let html = document.querySelector("html");
    let startGameBtn = document.createElement("button");
    startGameBtn.type = "button";
    startGameBtn.innerText = "Start Game";
    
    let startGameDiv = document.querySelector("#startGame");
    startGameDiv.appendChild(startGameBtn);

    let compDiv = document.querySelector("#compDiv");

    let score = 0;
    let scoreNum = 0;
    startGameBtn.addEventListener("click", async () => {
        try {
            let res1 = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
            deckID = res1.data.deck_id;
            // let cards = document.querySelector("#cards");
            let res2 = await axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`);
            startGameDiv.innerText = "";
            for(let i = 0; i < res2.data.cards.length; i++) {
                let img = document.createElement("img");
                img.src = res2.data.cards[i].image;
                startGameDiv.appendChild(img);
                logScore(res2.data.cards[i].value);
            } 
            // scoreDiv.innerText = "Your score is: " + score;
        }catch(err) {
            debugger;
        }
    })

    let buttonsDiv = document.querySelector("#buttons")
    let hit = document.createElement("button");
    hit.type = "button";
    hit.innerText = "Hit";
    buttonsDiv.appendChild(hit);

    let stay = document.createElement("button");
    stay.type = "button";
    stay.innerText = "Stay";
    buttonsDiv.appendChild(stay);

    hit.addEventListener("click", async () => {
        let newCard = await axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`);
        let img = document.createElement("img");
        img.src = newCard.data.cards[0].image;
        // debugger;
        startGameDiv.appendChild(img);
        logScore(newCard.data.cards[0].value);
    })

    stay.addEventListener("click", async () => {
        let compCards = await axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=3`)
        for(let i = 0; i < compCards.data.cards.length; i++) {
            let compCardsImg = document.createElement("img");
            compCardsImg.src = compCards.data.cards[i].image;
            compDiv.appendChild(compCardsImg);
            logCompScore(compCards.data.cards[i].value);
        }
        let compUpdate = document.createElement("p");
        compUpdate.innerText = "The computers score is: " + scoreNum;
        compScore.appendChild(compUpdate);

        let winner = document.createElement("h1");
        if(scoreNum > 21 || score > scoreNum) {
            winner.innerText = "You Win!";
            compScore.appendChild(winner);
        } else {
            winner.innerText = "You Lose!"
            compScore.appendChild(winner);
        }
    })

    const logScore = (value) => {
        let scoreDiv = document.querySelector("#score");
        if(value === "KING" || value === "QUEEN" || value === "JACK") {
            score += 10;
        } else if(value === "ACE" && score + 11 > 21) {
            score += 1;
        } else if(value === "ACE" && score + 11 <= 21) {
            score += 11;
        } else {
            score += Number(value);
        }

        let busted = document.createElement("h1");
        if(Number(score) > 21) {
            html.innerText = ""
            busted.innerText = "Busted!";
        } else if(Number(score) === 21) {
            busted.innerText = "You Win!"
        } else {
            scoreDiv.innerText = "Your score is: " + score;
            // busted.innerText = "Your score is: " + score;
        }
        html.appendChild(busted);

    }

    const logCompScore = (value) => {
        let compScore = document.querySelector("#compScore");
        if(value === "KING" || value === "QUEEN" || value === "JACK") {
            scoreNum += 10;
        } else if(value === "ACE" && scoreNum + 11 > 21) {
            scoreNum += 1;
        } else if(value === "ACE" && scoreNum + 11 <= 21) {
            scoreNum += 11;
        } else {
            scoreNum += Number(value);
        }
    }
})