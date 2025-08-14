document.addEventListener('DOMContentLoaded', () => {

  const questions = document.querySelectorAll('.question');
  let current = 0;

  function goToNextQuestion() {
    if (current < questions.length - 1) {
      questions[current].classList.remove('active');
      current++;
      questions[current].classList.add('active');
    }
  }

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


  function enableNextButton(questionEl) {
    const btn = questionEl.querySelector('.next-btn');
    if (!btn) return;

    btn.disabled = false;
    btn.textContent = 'Далі';
  }

  function resetNextButtons() {
    document.querySelectorAll('.next-btn').forEach(btn => {
      btn.disabled = true;
      btn.textContent = 'Оберіть відповідь';
    });
  }

  resetNextButtons();


  const updateNextButton = (questionEl, checkboxes, otherCheck = null, otherInput = null) => {
    const anyChecked = Array.from(checkboxes).some(c => c.checked);
    let isValid = false;

    if (otherCheck && otherCheck.checked) {
      isValid = otherInput && otherInput.value.trim() !== '';
    } else {
      isValid = anyChecked;
    }
    const nextBtn = questionEl.querySelector('.next-btn');
    if (!nextBtn) return;
    nextBtn.disabled = !isValid;
    nextBtn.textContent = isValid ? 'Далі' : 'Оберіть відповідь';
  };

  // MULTIPLE GROUP (multiple selection allowed)
  document.querySelectorAll('.multiple-group').forEach(group => {
    const questionEl = group.closest('.question');
    const checkboxes = group.querySelectorAll('input[type="checkbox"]');
    const otherCheck = group.querySelector('#otherCheck');
    const otherInput = group.querySelector('#otherInput');


    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        cb.closest('.checkbox-item').classList.toggle('selected', cb.checked);

        if (otherCheck && otherInput) {
          otherInput.style.display = otherCheck.checked ? 'block' : 'none';
          if (!otherCheck.checked) otherInput.value = '';
        }

        updateNextButton(questionEl, checkboxes, otherCheck, otherInput);
      });
    });

    if (otherInput) {
      otherInput.addEventListener('input', () => {
        updateNextButton(questionEl, checkboxes, otherCheck, otherInput);
      });
    }
  });

  // CHECKBOX GROUP (only one selection allowed)
  document.querySelectorAll('.checkbox-group').forEach(group => {
    const questionEl = group.closest('.question');
    const checkboxes = group.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        // Remove selection from all other checkboxes
        checkboxes.forEach(other => {
          if (other !== cb) {
            other.checked = false;
            other.closest('.checkbox-item').classList.remove('selected');
          }
        });

        // Add selected class to clicked checkbox
        cb.closest('.checkbox-item').classList.toggle('selected', cb.checked);

        updateNextButton(questionEl, checkboxes);
      });
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

// Send device info to Google Sheets
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("isSubmited")) {
    return;
  };

  const deviceInfo = navigator.userAgent; // Get user device info

  // Replace YOUR_GOOGLE_APPS_SCRIPT_URL with the URL from Step 2
  fetch("https://script.google.com/macros/s/AKfycbwce6x-LxpWC4tdS7iOaW7f78PXCTgTOfjteurojDm-96DinqSR5H353bW4_RfMYRi9/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `deviceInfo=${encodeURIComponent(deviceInfo)}`,
  })
    .then((response) => response.text())
    .then((data) => {
      localStorage.setItem("isSubmited", "true")
      console.log("Device info sent successfully:", data);
    })
    .catch((error) => {
      console.error("Error sending device info:", error);
    });
});