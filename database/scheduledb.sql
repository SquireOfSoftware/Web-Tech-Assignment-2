-- MySQL Script generated by MySQL Workbench
-- Tue Sep  5 20:39:10 2017
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema scheduledb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema scheduledb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `scheduledb` DEFAULT CHARACTER SET utf8 ;
USE `scheduledb` ;

-- -----------------------------------------------------
-- Table `scheduledb`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `scheduledb`.`User` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NOT NULL,
  `user_pass` VARCHAR(45) NOT NULL,
  `user_email` VARCHAR(45) NOT NULL,
  `user_dob` DATE NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC))
ENGINE = InnoDB
COMMENT = 'A User of the sceduling web application.';


-- -----------------------------------------------------
-- Table `scheduledb`.`Week`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `scheduledb`.`Week` (
  `week_number` INT NOT NULL,
  `week_year` YEAR NOT NULL,
  `week_id` INT NOT NULL,
  PRIMARY KEY (`week_id`))
ENGINE = InnoDB
COMMENT = 'A Week is a collection of 7 Days from Sunday - Saturday';


-- -----------------------------------------------------
-- Table `scheduledb`.`Day`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `scheduledb`.`Day` (
  `day_date` DATE NOT NULL,
  `day_name` VARCHAR(10) NOT NULL,
  `week_id` INT NOT NULL,
  PRIMARY KEY (`day_date`),
  INDEX `day_name_idx` (`week_id` ASC),
  CONSTRAINT `day_name`
    FOREIGN KEY (`week_id`)
    REFERENCES `scheduledb`.`Week` (`week_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'A single day';


-- -----------------------------------------------------
-- Table `scheduledb`.`Role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `scheduledb`.`Role` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(45) NULL,
  `role_description` VARCHAR(255) NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE INDEX `role_id_UNIQUE` (`role_id` ASC))
ENGINE = InnoDB
COMMENT = 'What a User will be assigned to on a Shift';


-- -----------------------------------------------------
-- Table `scheduledb`.`Shift`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `scheduledb`.`Shift` (
  `shift_id` INT NOT NULL,
  `shift_start` TIME NULL,
  `shift_end` TIME NULL,
  `day_date` DATE NULL,
  `user_id` INT NULL,
  `role_id` INT NULL,
  PRIMARY KEY (`shift_id`),
  INDEX `day_date_idx` (`day_date` ASC),
  INDEX `user_id_idx` (`user_id` ASC),
  INDEX `role_id_idx` (`role_id` ASC),
  UNIQUE INDEX `shift_id_UNIQUE` (`shift_id` ASC),
  CONSTRAINT `day_date`
    FOREIGN KEY (`day_date`)
    REFERENCES `scheduledb`.`Day` (`day_date`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `scheduledb`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `role_id`
    FOREIGN KEY (`role_id`)
    REFERENCES `scheduledb`.`Role` (`role_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'A shift';

USE `scheduledb`;

DELIMITER $$
USE `scheduledb`$$
CREATE DEFINER = CURRENT_USER TRIGGER `scheduledb`.`Week_BEFORE_INSERT` BEFORE INSERT ON `Week` FOR EACH ROW
BEGIN
	IF week_number = 53 THEN
		SET week_number = 1;
	END IF;
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
