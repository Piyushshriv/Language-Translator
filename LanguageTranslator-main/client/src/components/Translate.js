// Translate.js
import React, { useEffect } from "react";
import countries from "./Data.js";

const Translate = () => {
	useEffect(() => {
		const fromText = document.querySelector(".from-text");
		const toText = document.querySelector(".to-text");
		const exchangeIcon = document.querySelector(".exchange");
		const selectTags = document.querySelectorAll("select");
		const icons = document.querySelectorAll(".row i");
		const translateBtn = document.querySelector("button");

		selectTags.forEach((tag, id) => {
			for (let country_code in countries) {
				let selected =
					id === 0
						? country_code === "en-GB"
							? "selected"
							: ""
						: country_code === "hi-IN"
							? "selected"
							: "";
				let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
				tag.insertAdjacentHTML("beforeend", option);
			}
		});

		exchangeIcon.addEventListener("click", () => {
			let tempText = fromText.value;
			let tempLang = selectTags[0].value;
			fromText.value = toText.value;
			toText.value = tempText;
			selectTags[0].value = selectTags[1].value;
			selectTags[1].value = tempLang;
		});

		fromText.addEventListener("keyup", () => {
			if (!fromText.value) {
				toText.value = "";
			}
		});

		translateBtn.addEventListener("click", async () => {
			let text = fromText.value.trim();
			let translateFrom = selectTags[0].value;
			let translateTo = selectTags[1].value;
			if (!text) return;
			toText.setAttribute("placeholder", "Translating...");
			try {
				const response = await fetch(`http://localhost:5000/?text=${text}&source=${translateFrom}&target=${translateTo}`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const translatedText = await response.text();
				toText.value = translatedText;
				toText.setAttribute("placeholder", "Translation");
			} catch (error) {
				console.error("Fetch error:", error);
				toText.setAttribute("placeholder", "Error in translation");
			}
		});

		icons.forEach((icon) => {
			icon.addEventListener("click", ({ target }) => {
				if (!fromText.value && !toText.value) return;
				if (target.classList.contains("fa-copy")) {
					navigator.clipboard.writeText(target.id === "from" ? fromText.value : toText.value);
				} else {
					let utterance = new SpeechSynthesisUtterance(target.id === "from" ? fromText.value : toText.value);
					utterance.lang = target.id === "from" ? selectTags[0].value : selectTags[1].value;
					speechSynthesis.speak(utterance);
				}
			});
		});
	}, []);

	return (
		<>
			<div className="above-container">
				<img
					src={"https://tse1.mm.bing.net/th?id=OIP.yDgRUs-oZJNvHjPV_HF80gHaHa&pid=Api&P=0&h=180"}
					className="above-container-content"
					alt="GeeksforGeeks Logo"
				/>
				<h1 className="above-container-content">Get your own language alternative</h1>
				<img
					src={"https://tse1.mm.bing.net/th?id=OIP.yDgRUs-oZJNvHjPV_HF80gHaHa&pid=Api&P=0&h=180"}
					className="above-container-content"
					alt="GeeksforGeeks Logo"
				/>
			</div>

			<div className="container">
				<div className="wrapper">
					<div className="text-input">
						<textarea
							spellCheck="false"
							className="from-text"
							placeholder="Enter text"
						></textarea>
						<textarea
							spellCheck="false"
							readOnly
							className="to-text"
							placeholder="Translation"
						></textarea>
					</div>
					<ul className="controls">
						<li className="row from">
							<div className="icons">
								<i id="from" className="fas fa-volume-up"></i>
								<i id="from" className="fas fa-copy"></i>
							</div>
							<select></select>
						</li>
						<li className="exchange">
							<i className="fas fa-exchange-alt"></i>
						</li>
						<li className="row to">
							<select></select>
							<div className="icons">
								<i id="to" className="fas fa-volume-up"></i>
								<i id="to" className="fas fa-copy"></i>
							</div>
						</li>
					</ul>
				</div>
				<button>Translate Text</button>
			</div>
		</>
	);
};

export default Translate;
