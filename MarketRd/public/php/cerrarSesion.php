<?php
require_once __DIR__ '/Config/conexion.php';
session_start();

$_SESSION = [];

session_destroy();

header("Location: login.html");
exit;
