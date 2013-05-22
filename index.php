<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>105,bry</title>
</head>
<body>
<?php
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

echo '<img src="./logo.png">';
?>

<script type="text/javascript" src="http://www.caster.fm/embed.php?uid=113641"></script>
<iframe frameborder="0" height="240" width="264" src="http://www.caster.fm/status_embed.php?uid=113641" scrolling="no" name="casterframe"></iframe>
<?php 
$variable = '<br>Läs post och kolla om det finns en entry som heter penis';
echo $variable;
?>
</body>
</html>
