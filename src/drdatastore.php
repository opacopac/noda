<?php declare(strict_types=1);

// show errors on web page
error_reporting(E_ALL);
ini_set('display_errors', '1');

header("Access-Control-Allow-Origin: *");

DrDataStore::processRequest(
    $_SERVER['REQUEST_METHOD'],
    $_GET,
    json_decode(file_get_contents('php://input'), TRUE)
);


class DrDataStore {
    const DRDATA_FILE = './tmp/drdata.json';

    public static function processRequest(string $requestMethod, ?array $getVars, ?array $postVars) {
        switch ($requestMethod) {
            case 'GET':
                self::readDrData();
                break;
            case 'POST':
                if (!$postVars) {
                    throw new InvalidArgumentException('argument drdata missing');
                }
                self::saveDrData($postVars["drdata"]);
                break;
            case 'OPTIONS':
                header('Access-Control-Allow-Origin: *');
                header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
                header('Access-Control-Allow-Headers: *');
                break;
            default:
                throw new InvalidArgumentException('unknown request method ' . $requestMethod);
        }
    }


    public static function readDrData() {
        $drData = self::readDrDataFromFile();
        if ($drData) {
            self::sendJson($drData);
        } else {
            self::sendJson('');
        }
    }


    public static function saveDrData(string $drData) {
        self::storeDrDataToFile($drData);
    }


    public static function storeDrDataToFile(string $drData) {
        file_put_contents(self::DRDATA_FILE, $drData);
    }


    public static function readDrDataFromFile(): string {
        if (!file_exists(self::DRDATA_FILE)) {
            return '';
        }

        $drData = file_get_contents(self::DRDATA_FILE);

        if ($drData === FALSE) {
            return '';
        } else {
            return $drData;
        }
    }


    private static function sendJson(string $data) {
        header("Content-Type: application/json; charset=UTF-8");
        echo $data;
    }
}
