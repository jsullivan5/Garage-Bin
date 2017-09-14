$(document).ready(() => {
  fetch('api/v1/items')
    .then(response => response.json())
    .then(items => {
      console.log(items);

      items.forEach(item => {
        const sparklingSelect = item.cleanliness === 'Sparkling' ? 'selected' : null;
        const dustySelect = item.cleanliness === 'Dusty' ? 'selected' : null;
        const rancidSelect = item.cleanliness === 'Rancid' ? 'selected' : null;
        
        $('#garage-door').prepend(`
          <section class="item-card">
            <p>${item.name}</p>
            <p>${item.reason}</p>
            <select value=${item.cleanliness.toString()}>
              <option value="Sparkling" ${sparklingSelect}>Sparkling</option>
              <option value="Dusty" ${dustySelect}>Dusty</option>
              <option value="Rancid" ${rancidSelect}>Rancid</option>
            </select>
          </section>`)
      })
    })
});

$('#form-submit').click((event) => {
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
    const sparklingSelect = item.cleanliness === 'Sparkling' ? 'selected' : null;
    const dustySelect = item.cleanliness === 'Dusty' ? 'selected' : null;
    const rancidSelect = item.cleanliness === 'Rancid' ? 'selected' : null;

    $('#garage-door').prepend(`
      <section class="item-card">
        <p>${item.name}</p>
        <p>${item.reason}</p>
        <select value=${item.cleanliness.toString()}>
          <option value="Sparkling" ${sparklingSelect}>Sparkling</option>
          <option value="Dusty" ${dustySelect}>Dusty</option>
          <option value="Rancid" ${rancidSelect}>Rancid</option>
        </select>
      </section>`)
  })
  .catch(error => console.log(error))
})
