const questions = document.querySelectorAll('.question');
let current = 0;

function goToNextQuestion() {
  if (current < questions.length - 1) {
    questions[current].classList.remove('active');
    current++;
    questions[current].classList.add('active');
  }
}

document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('change', () => {
    goToNextQuestion();
  });
});

// Trigger when clicking a custom-select option
document.querySelectorAll('.custom-select [role="option"]').forEach(option => {
  option.addEventListener('click', () => {
    // set selected value text
    const button = option.closest('.custom-select').querySelector('.selected-value');
    button.textContent = option.textContent.trim();
    // close dropdown (optional)
    option.closest('.custom-select').querySelector('.select-dropdown').classList.add('hidden');

    const questionEl = img.closest('.question');
    const btn = questionEl.querySelector('.next-btn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Далі'; 
    }

  });
});

document.addEventListener('DOMContentLoaded', () => {
  function enableNextButton(questionEl) {
    const btn = questionEl.querySelector('.next-btn');
    if (!btn) return;

    btn.disabled = false;
    btn.textContent = 'Далі';
  }

  function disableNextButton(questionEl) {
    const btn = questionEl.querySelector('.next-btn');
    if (!btn) return;

    btn.disabled = true;
    btn.textContent = 'Оберіть відповідь';
  }

  function resetNextButtons() {
    document.querySelectorAll('.next-btn').forEach(btn => {
      btn.disabled = true;
      btn.textContent = 'Оберіть відповідь';
    });
  }

  resetNextButtons();

  // Для input[type=text]
  document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', () => {
      const questionEl = input.closest('.question');
      if (input.value.trim() !== '') {
        enableNextButton(questionEl);
      } else {
        disableNextButton(questionEl);
      }
    });
  });

  // Для textarea
  document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', () => {
      const questionEl = textarea.closest('.question');
      if (textarea.value.trim() !== '') {
        enableNextButton(questionEl);
      } else {
        disableNextButton(questionEl);
      }
    });
  });

  // Для стандартних select
  document.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', () => {
      const questionEl = select.closest('.question');
      if (select.value && select.value !== '') {
        enableNextButton(questionEl);
      } else {
        disableNextButton(questionEl);
      }
    });
  });

  // Для кастомного селекту (обробник кліку по опції)
  document.querySelectorAll('.custom-select [role="option"]').forEach(option => {
    option.addEventListener('click', () => {
      const questionEl = option.closest('.question');
      // Тут можна додатково перевірити, що вибрано, але якщо клік — вважай вибір зроблено
      enableNextButton(questionEl);
    });
  });

  // Для десертів
  document.querySelectorAll('.dessert').forEach(img => {
    img.addEventListener('click', () => {
      const questionEl = img.closest('.question');
      enableNextButton(questionEl);
    });
  });

  // Обробник кліку на кнопках next
  document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!btn.disabled) {
        goToNextQuestion();
      }
    });
  });

  // Додатково, якщо хочеш перейти на наступне питання по ентеру у textarea
  document.querySelectorAll('textarea').forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const questionEl = el.closest('.question');
        if (!questionEl.querySelector('.next-btn').disabled) {
          goToNextQuestion();
        }
      }
    });
  });
});



document.querySelectorAll('.dessert').forEach(img => {
  img.addEventListener('click', () => {
    // Remove selection from all
    document.querySelectorAll('.dessert').forEach(i => i.classList.remove('selected'));
    // Mark clicked as selected
    img.classList.add('selected');
    // Update hidden input
    document.getElementById('selectedDessert').value = img.dataset.name;
    // Go to next question
    const questionEl = img.closest('.question');
    const btn = questionEl.querySelector('.next-btn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Далі'; 
    }
  });
});

document.getElementById('dessertForm').addEventListener('submit', function (e) {
  setTimeout(() => {
    this.reset();

    const questions = document.querySelectorAll('.question');
    questions.forEach(q => q.classList.remove('active'));
    questions[0].classList.add('active');
    current = 0;
  }, 100);
});


document.addEventListener("DOMContentLoaded", () => {
  const customSelects = document.querySelectorAll(".custom-select");

  customSelects.forEach((customSelect) => {
    const selectButton = customSelect.querySelector(".select-button");
    const dropdown = customSelect.querySelector(".select-dropdown");
    const options = dropdown.querySelectorAll("li");
    const selectedValue = selectButton.querySelector(".selected-value");

    let focusedIndex = -1;

    const toggleDropdown = (expand = null) => {
      const isOpen =
        expand !== null ? expand : dropdown.classList.contains("hidden");
      dropdown.classList.toggle("hidden", !isOpen);
      selectButton.setAttribute("aria-expanded", isOpen);

      if (isOpen) {
        focusedIndex = [...options].findIndex((option) =>
          option.classList.contains("selected")
        );
        focusedIndex = focusedIndex === -1 ? 0 : focusedIndex;
        updateFocus();
      } else {
        focusedIndex = -1;
        selectButton.focus();
      }
    };

    const updateFocus = () => {
      options.forEach((option, index) => {
        if (option) {
          option.setAttribute("tabindex", index === focusedIndex ? "0" : "-1");
          if (index === focusedIndex) option.focus();
        }
      });
    };

    const handleOptionSelect = (option) => {
      options.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
      selectedValue.textContent = option.textContent.trim();
      if (option.dataset.value === "clear") {
        // Reset to the default value
        selectedValue.textContent = "Оберіть";
        options.forEach((opt) => opt.classList.remove("selected"));
        return;
      }
    };

    options.forEach((option) => {
      option.addEventListener("click", () => {
        handleOptionSelect(option);
        toggleDropdown(false);
      });
    });

    selectButton.addEventListener("click", () => {
      toggleDropdown();
    });

    selectButton.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        toggleDropdown(true);
      } else if (event.key === "Escape") {
        toggleDropdown(false);
      }
    });

    dropdown.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusedIndex = (focusedIndex + 1) % options.length;
        updateFocus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        focusedIndex = (focusedIndex - 1 + options.length) % options.length;
        updateFocus();
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleOptionSelect(options[focusedIndex]);
        toggleDropdown(false);
      } else if (event.key === "Escape") {
        toggleDropdown(false);
      }
    });

    document.addEventListener("click", (event) => {
      const isOutsideClick = !customSelect.contains(event.target);

      if (isOutsideClick) {
        toggleDropdown(false);
      }
    });
  });
});