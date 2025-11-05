CREATE DATABASE HotelReservation;
USE HotelReservation;

CREATE TABLE Hotel(
	Id				INT AUTO_INCREMENT PRIMARY KEY,
	`Name`			VARCHAR(100) NOT NULL,
	`Description`	LONGTEXT NOT NULL,
	RoomsCount		INT
);


CREATE TABLE HotelReservationAdditional(
	Id				INT AUTO_INCREMENT PRIMARY KEY,
	`Name`			VARCHAR(100) NOT NULL
);


CREATE TABLE AgeDescription(
	Id				INT AUTO_INCREMENT PRIMARY KEY,
	`Name`			VARCHAR(100) NOT NULL
);

CREATE TABLE HotelReservation(
	Id					INT AUTO_INCREMENT PRIMARY KEY,
	IdHotel				INT NOT NULL,
	Surname				VARCHAR(100) NOT NULL,
	NumberPeople		INT NOT NULL,
	RoomsCount			INT NOT NULL,
	StartDate			DATE,
	EndDate				DATE,
	Email				VARCHAR(100) NOT NULL,
	IdAgeDescription	INT NOT NULL
);
ALTER TABLE HotelReservation
ADD CONSTRAINT HotelReservation_Hotel_REF
FOREIGN KEY(IdHotel)
REFERENCES Hotel(Id);
ALTER TABLE HotelReservation
ADD CONSTRAINT HotelReservation_AgeDescription_REF
FOREIGN KEY(IdAgeDescription)
REFERENCES AgeDescription(Id);

CREATE TABLE HotelReservation_HotelReservationAdditional(
	IdHotelReservation				INT NOT NULL,
	IdHotelReservationAdditional	INT NOT NULL
);
ALTER TABLE HotelReservation_HotelReservationAdditional
ADD CONSTRAINT HR_HRA__HotelReservation_REF
FOREIGN KEY(IdHotelReservation)
REFERENCES HotelReservation(Id);
ALTER TABLE HotelReservation_HotelReservationAdditional
ADD CONSTRAINT HR_HRA__HotelReservationAdditional_REF
FOREIGN KEY(IdHotelReservationAdditional)
REFERENCES HotelReservationAdditional(Id);


CREATE TABLE `Admin` (
	Id				INT AUTO_INCREMENT PRIMARY KEY,
	Login			VARCHAR(64) UNIQUE NOT NULL,
	PasswordHash	CHAR(60) NOT NULL
);

