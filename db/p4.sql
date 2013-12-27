SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS `forgetless` ;
CREATE SCHEMA IF NOT EXISTS `forgetless` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `forgetless` ;

-- -----------------------------------------------------
-- Table `forgetless`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`user` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `title` VARCHAR(10) NOT NULL ,
  `first_name` VARCHAR(255) NOT NULL ,
  `last_name` VARCHAR(255) NOT NULL ,
  `email` VARCHAR(255) NOT NULL ,
  `password_hash` VARCHAR(64) NOT NULL ,
  `reset_password_hash` VARCHAR(64) NULL ,
  `user_token_hash` VARCHAR(45) NULL ,
  `zone_id` INT(11) NOT NULL DEFAULT 1 ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `forgetless`.`item`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`item` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`item` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `zone_id` INT NOT NULL DEFAULT 1 ,
  `title` VARCHAR(255) NOT NULL ,
  `content` TEXT NULL ,
  `duration` INT NULL ,
  `deadline` VARCHAR(45) NULL ,
  `item_type` INT NULL ,
  `audit_id` INT(11) NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `item_id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `forgetless`.`audit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`audit` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`audit` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `date_created` DATETIME NOT NULL ,
  `date_deleted` DATETIME NULL ,
  `last_modified` DATETIME NOT NULL ,
  `last_modified_by` INT NOT NULL ,
  `audit_log` TEXT NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `forgetless`.`reminder`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`reminder` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`reminder` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `date_time` DATETIME NOT NULL ,
  `repeat` VARCHAR(45) NULL ,
  `zone_id` INT NOT NULL ,
  `item_id` INT(11) NOT NULL ,
  `user_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `forgetless`.`item_link`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`item_link` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`item_link` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `user_id` INT NOT NULL ,
  `flag` INT(1) NOT NULL ,
  `item_id` INT(11) NOT NULL ,
  `list_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `forgetless`.`list`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`list` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`list` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `title` VARCHAR(255) NOT NULL ,
  `description` TEXT NULL ,
  `zone_id` INT(1) NOT NULL ,
  `audit_id` INT(1) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `forgetless`.`list_link`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`list_link` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`list_link` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `title` VARCHAR(255) NOT NULL ,
  `user_id` INT NOT NULL ,
  `parent_list_id` INT(11) NULL ,
  `list_id` INT(11) NOT NULL ,
  `category_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `forgetless`.`category_link`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`category_link` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`category_link` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `title` VARCHAR(255) NOT NULL ,
  `category_id` INT(11) NOT NULL ,
  `user_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `forgetless`.`category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`category` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `zone_id` INT NOT NULL ,
  `title` VARCHAR(255) NOT NULL ,
  `audit_id` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
