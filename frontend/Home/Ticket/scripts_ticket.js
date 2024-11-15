document.getElementById('back-button').addEventListener('click', function() {
	window.location.href = '../home.html';
});

document.getElementById('print-button').addEventListener('click', function() {
	const ticketElement = document.getElementById('ticket-container');

	html2canvas(ticketElement).then(function(canvas) {
		const imgData = canvas.toDataURL('image/png');
		const doc = new jsPDF();

		const imgWidth = 190;
		const pageHeight = 295;
		const imgHeight = canvas.height * imgWidth / canvas.width;

		let position = 10;
		doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

		doc.save('ticket.pdf');
	});
});
