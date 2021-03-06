-- MySQL Script generated by MySQL Workbench
-- Wed Sep 20 21:35:59 2017
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
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `salt` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC))
ENGINE = InnoDB
COMMENT = 'A User of the sceduling web application.';


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
  `shift_id` INT NOT NULL AUTO_INCREMENT,
  `shift_start` DATETIME NOT NULL,
  `shift_end` DATETIME NOT NULL,
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  `approved` TINYINT(1) NOT NULL,
  PRIMARY KEY (`shift_id`),
  INDEX `user_id_idx` (`user_id` ASC),
  INDEX `role_id_idx` (`role_id` ASC),
  UNIQUE INDEX `shift_id_UNIQUE` (`shift_id` ASC),
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


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
