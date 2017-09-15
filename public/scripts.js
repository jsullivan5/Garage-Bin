$(document).ready(getItems);

$('#form-submit').click(postItem)
$('#garage-door').on('change', '.card-select', updateItem)
$('#garage-door').on('click', '.item-card', toggleHidden)
$('#door-btn').click(toggleDoor);

$('#alphabetize').on('click', function(){
  console.log('working');
  const $items = $('.item-card')
  const sortedItems = $items.sort((a,b) => {
    return $(a).data('name').toLowerCase() > $(b).data('name').toLowerCase();
  });
  $("#garage-door").html(sortedItems);
});


function generateItemCard(item) {
  const sparklingSelect = item.cleanliness === 'Sparkling' ? 'selected' : null;
  const dustySelect = item.cleanliness === 'Dusty' ? 'selected' : null;
  const rancidSelect = item.cleanliness === 'Rancid' ? 'selected' : null;

  incrementCount(item.cleanliness)

  $('#garage-door').prepend(`
    <section class="item-card" data-name=${item.name}>
      <h3 class="card-name">${item.name}</h3>
      <div class="hidden collapsable-content">
        <p">${item.reason}</p>
        <select class="card-select" name=${item.id}>
          <option value="Sparkling" ${sparklingSelect}>Sparkling</option>
          <option value="Dusty" ${dustySelect}>Dusty</option>
          <option value="Rancid" ${rancidSelect}>Rancid</option>
        </select>
      </div>
    </section>`)
}

function getItems() {
  fetch('api/v1/items')
    .then(response => response.json())
    .then(items => {
      const totalCount = items.length;

      items.forEach(item => {
        generateItemCard(item);
      });
      $('#total-count').text(totalCount);
    });
};

function postItem(event) {
  event.preventDefault();
  const name = $('#form-name').val();
  const reason = $('#form-reason').val();
  const cleanliness = $('#form-cleanliness').val();

  fetch('/api/v1/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      name,
      reason,
      cleanliness
    })
  })
  .then(response => response.json())
  .then((item) => {
    generateItemCard(item);
  })
  .catch(error => console.log(error))
}

function updateItem(event) {
  const newCleanliness = event.target.value;
  const id = event.target.name;

  fetch(`/api/v1/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ cleanliness: newCleanliness })
  })
  .then(response => response.json())
  .catch(error => console.log(error));
}

function toggleHidden() {
  const targetElem = event.target;

  $(targetElem).siblings().toggleClass('hidden')
}

function toggleDoor() {
  if ($('#garage-img').hasClass('open-door')) {
    $('#garage-img').addClass('close-door');
    $('#garage-img').removeClass('open-door');
  } else {
    $('#garage-img').addClass('open-door');
    $('#garage-img').removeClass('close-door');
  }
}

function incrementCount(name) {
  const $element = $(`#${name}-count`);
  let count = parseInt($($element).text(), 10)

  count++
  $($element).text(count)
}
