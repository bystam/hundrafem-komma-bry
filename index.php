<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>105,bry</title>
</head>
<body>
<?php
$variable = 'Läs post och kolla om det finns en entry som heter penis';


echo $variable;

if (isset($_GET['image'])) {
	$type = $_GET['image'];
	echo '<pre>';
	if ($type == 'camel') {
		readfile('camel');
	}
	if ($type == 'bird') {
		readfile('bird');
	}
	if ($type == 'monkey') {
		readfile('monkey');
	}
	echo '</pre>';
}


?>
</body>
</html>
