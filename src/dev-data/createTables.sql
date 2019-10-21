CREATE TABLE vehicleTypes(
  vehicleTypeName VARCHAR(50) PRIMARY KEY,
  dayRate INT UNSIGNED NOT NULL
);
CREATE TABLE customers(
  driversLicence VARCHAR(50) PRIMARY KEY,
  phone VARCHAR(50) NOT NULL,
  name VARCHAR(50) NOT NULL
);
CREATE TABLE vehicles(
  vehicleLicence VARCHAR(50) PRIMARY KEY,
  make VARCHAR(50),
  model VARCHAR(50),
  year YEAR,
  color VARCHAR(50),
  status ENUM("rented", "maintenance", "available") NOT NULL,
  vehicleTypeName VARCHAR(50) NOT NULL,
  location VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  CONSTRAINT vehicle_vehicleType FOREIGN KEY (vehicleTypeName) REFERENCES vehicleTypes(vehicleTypeName) ON DELETE CASCADE
);
CREATE TABLE reservations(
  confNum VARCHAR(50) PRIMARY KEY,
  vehicleTypeName VARCHAR(50) NOT NULL,
  driversLicence VARCHAR(50) NOT NULL,
  fromDate DATE NOT NULL,
  toDate DATE NOT NULL,
  CONSTRAINT reservation_vehicleType FOREIGN KEY (vehicleTypeName) REFERENCES vehicleTypes(vehicleTypeName) ON DELETE CASCADE,
  CONSTRAINT reservation_customer FOREIGN KEY (driversLicence) REFERENCES customers (driversLicence) ON DELETE CASCADE
);
CREATE TABLE rents(
  rentId VARCHAR(50) PRIMARY KEY,
  vehicleLicence VARCHAR(50) NOT NULL,
  driversLicence VARCHAR(50) NOT NULL,
  fromDate DATE NOT NULL,
  toDate DATE NOT NULL,
  confNum VARCHAR(255) UNIQUE,
  CONSTRAINT rent_vehicle FOREIGN KEY (vehicleLicence) REFERENCES vehicles(vehicleLicence) ON DELETE CASCADE,
  CONSTRAINT rent_customer FOREIGN KEY (driversLicence) REFERENCES customers(driversLicence) ON DELETE CASCADE,
  CONSTRAINT rent_reservation FOREIGN KEY (confNum) REFERENCES reservations(confNum) ON DELETE CASCADE
);
CREATE TABLE returns(
  rentId VARCHAR(50) PRIMARY KEY,
  date DATE NOT NULL,
  price INT NOT NULL,
  returnMessage VARCHAR(500),
  CONSTRAINT return_rent FOREIGN KEY (rentId) REFERENCES rents(rentId) ON DELETE CASCADE
);