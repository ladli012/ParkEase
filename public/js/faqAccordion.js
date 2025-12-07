document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      // Close all other faq items
      faqItems.forEach(i => {
        if (i !== item) {
          i.classList.remove('active');
          i.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      // Toggle clicked faq item
      item.classList.toggle('active');

      const answer = item.querySelector('.faq-answer');
      if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // Initially collapse all answers
  faqItems.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    answer.style.maxHeight = '0';
  });
});





