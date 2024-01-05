const updateFlashcard = async (answeredRight, selectedBrackets) => {
  try {
    // Filter sessionFlashcards based on selected brackets
    let relevantFlashcards = sessionFlashcards.filter((flashcard) =>
      selectedBrackets.includes(flashcard.bracket)
    );

    // Find an untrained flashcard
    const untrainedFlashcard = relevantFlashcards.find(
      (flashcard) => !flashcard.trained
    );
    if (untrainedFlashcard) {
      untrainedFlashcard.trained = true;
      if (answeredRight && untrainedFlashcard.bracket <= 6) {
        setNumberCurrent(numberCurrent + 1);
        if (currentFlashcard == 1) {
          console.log("answered right");
          setBoxTwo("green");
          untrainedFlashcard.bracket++;
          setTimeout(() => {
            setBoxTwo("black");
          }, 1000);
        }
        if (currentFlashcard == 2) {
          console.log("answered right");
          setBoxThree("green");
          untrainedFlashcard.bracket++;
          setTimeout(() => {
            setBoxThree("black");
          }, 1000);
        }
        if (currentFlashcard == 3) {
          console.log("answered right");
          setBoxFour("green");
          untrainedFlashcard.bracket++;
          setTimeout(() => {
            setBoxFour("black");
          }, 1000);
        }
        if (currentFlashcard == 4) {
          console.log("answered right");
          setBoxFive("green");
          untrainedFlashcard.bracket++;
          setTimeout(() => {
            setBoxFive("black");
          }, 1000);
        }
        if (currentFlashcard == 5) {
          console.log("answered right");
          setShowRainbowCrown(true);
          setBoxCrown("green");
          untrainedFlashcard.bracket++;
          setTimeout(() => {
            setShowRainbowCrown(false);
            setBoxCrown("black");
          }, 1000);
        }
        if (currentFlashcard == 6) {
          console.log("answered right");
          setBoxCrown("green");
          setTimeout(() => {
            setBoxCrown("black");
          }, 1000);
        }
      } else if (!answeredRight && untrainedFlashcard.bracket > 1) {
        setNumberCurrent(numberCurrent + 1);
        if (currentFlashcard == 2) {
          console.log("answered wrong");
          setBoxOne("red");
          //wait for 1 second and set it back to black
          setTimeout(() => {
            setBoxOne("black");
          }, 1000);
        }

        if (currentFlashcard == 3) {
          console.log("answered right");
          setBoxTwo("red");
          setTimeout(() => {
            setBoxTwo("black");
          }, 1000);
        }
        if (currentFlashcard == 4) {
          console.log("answered right");
          setBoxThree("red");
          setTimeout(() => {
            setBoxThree("black");
          }, 1000);
        }
        if (currentFlashcard == 5) {
          console.log("answered right");
          setBoxFour("red");
          setTimeout(() => {
            setBoxFour("black");
          }, 1000);
        }
        untrainedFlashcard.bracket--;
      } else if (!answeredRight && untrainedFlashcard.bracket == 1) {
        setNumberCurrent(numberCurrent + 1);
        if (currentFlashcard == 1) {
          console.log("answered wrong");
          setBoxOne("red");
          //wait for 1 second and set it back to black
          setTimeout(() => {
            setBoxOne("black");
          }, 1000);
        }
      }

      // Update sessionFlashcards state
      setSessionFlashcards((currentFlashcards) =>
        currentFlashcards.map((flashcard) => {
          return flashcard.id === untrainedFlashcard.id
            ? untrainedFlashcard
            : flashcard;
        })
      );

      // Find the next untrained flashcard and update the state
      const nextUntrainedFlashcard = sessionFlashcards.find(
        (flashcard) =>
          !flashcard.trained && selectedBrackets.includes(flashcard.bracket)
      );
      if (nextUntrainedFlashcard) {
        setCurrentFlashcard(nextUntrainedFlashcard.bracket);
        setFlashcardFront(nextUntrainedFlashcard.frontContent);
        setCurrentBracket(nextUntrainedFlashcard.bracket);
        setCurrentDate(nextUntrainedFlashcard.creationDate);
        setFlashcardBack(nextUntrainedFlashcard.backContent);
      } else {
        // Handle the scenario where there are no more untrained flashcards
        // For example, clear the display or show a completion message
        setCurrentFlashcard(0);
        setFlashcardFront("");
        setCurrentBracket(0);
        setCurrentDate("");
        setFlashcardBack("");
      }

      // Check if all flashcards have been trained
      const allTrained = relevantFlashcards.every(
        (flashcard) => flashcard.trained
      );
      if (allTrained) {
        try {
          const userRef = doc(firestore, "users", uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data().data;
            const lastClickedCategory = userDoc.data().InCategory;

            // Process only the category that matches lastClickedCategory
            userData.forEach((category) => {
              if (category.title === lastClickedCategory) {
                // Check if category title matches
                category.subcategories.forEach((subcategory) => {
                  const flashcardsHolder =
                    subcategory[Object.keys(subcategory)[0]].flashcardsHolder ||
                    [];
                  flashcardsHolder.forEach(
                    (flashcard, index, flashcardsArray) => {
                      const sessionFlashcard = sessionFlashcards.find(
                        (sf) => sf.id === flashcard.id
                      );
                      if (sessionFlashcard) {
                        // Set trained property to false before updating
                        const updatedFlashcard = {
                          ...sessionFlashcard,
                          trained: false,
                        };
                        flashcardsArray[index] = updatedFlashcard;
                      }
                    }
                  );
                });
              }
            });

            // Update Firestore with the modified userData
            await updateDoc(userRef, {
              data: userData,
            });
          }
        } catch (error) {
          console.error("Error updating Firestore:", error);
        }
        setNumberCurrent(0);
        setNumberTotal(0);

        setCheckboxes(checkboxesAfter);
        setFlashcardFront("");
        setFlashcardBack("");
        setModalVisible(true);
        fetchData();
      }
    }
  } catch (error) {
    console.error("Error updating flashcard:", error);
  }
};
