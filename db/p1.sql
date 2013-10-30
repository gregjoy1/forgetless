SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

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
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


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
-- Table `forgetless`.`item`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`item` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`item` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `zone_id` INT NOT NULL DEFAULT 1 ,
  `title` VARCHAR(255) NOT NULL ,
  `content` TEXT NULL ,
  `duration` INT NULL ,
  `audit_id` INT NOT NULL ,
  `deadline` VARCHAR(45) NULL ,
  `item_type` INT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `item_id_UNIQUE` (`id` ASC) ,
  INDEX `fk_item_audit1` (`audit_id` ASC) ,
  CONSTRAINT `fk_item_audit1`
    FOREIGN KEY (`audit_id` )
    REFERENCES `forgetless`.`audit` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `forgetless`.`reminder`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`reminder` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`reminder` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `item_id` INT NOT NULL ,
  `user_id` INT NOT NULL ,
  `date_time` DATETIME NOT NULL ,
  `repeat` VARCHAR(45) NULL ,
  `zone_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_reminder_item1` (`item_id` ASC) ,
  INDEX `fk_reminder_user1` (`user_id` ASC) ,
  CONSTRAINT `fk_reminder_item1`
    FOREIGN KEY (`item_id` )
    REFERENCES `forgetless`.`item` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reminder_user1`
    FOREIGN KEY (`user_id` )
    REFERENCES `forgetless`.`user` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
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
-- Table `forgetless`.`item_link`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`item_link` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`item_link` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `list_id` INT NOT NULL ,
  `item_id` INT NOT NULL ,
  `user_id` INT NOT NULL ,
  `flag` INT(1) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_item_link_list1` (`list_id` ASC) ,
  INDEX `fk_item_link_item1` (`item_id` ASC) ,
  CONSTRAINT `fk_item_link_list1`
    FOREIGN KEY (`list_id` )
    REFERENCES `forgetless`.`list` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_item_link_item1`
    FOREIGN KEY (`item_id` )
    REFERENCES `forgetless`.`item` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `forgetless`.`list_link`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `forgetless`.`list_link` ;

CREATE  TABLE IF NOT EXISTS `forgetless`.`list_link` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `user_id` INT NOT NULL ,
  `list_id` INT NOT NULL ,
  `parent_list_id` INT NOT NULL ,
  `title` VARCHAR(255) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_list_link_user` (`user_id` ASC) ,
  INDEX `fk_list_link_list_link1` (`parent_list_id` ASC) ,
  INDEX `fk_list_link_list1` (`list_id` ASC) ,
  CONSTRAINT `fk_list_link_user`
    FOREIGN KEY (`user_id` )
    REFERENCES `forgetless`.`user` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_list_link_list_link1`
    FOREIGN KEY (`parent_list_id` )
    REFERENCES `forgetless`.`list_link` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_list_link_list1`
    FOREIGN KEY (`list_id` )
    REFERENCES `forgetless`.`list` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
