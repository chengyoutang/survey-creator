import * as ko from "knockout";
import * as Survey from "survey-knockout";
import {
  TranslationGroup,
  TranslationItem,
  Translation
} from "../src/translation";
import { equal } from "assert";

export default QUnit.module("TranslatonTests");

QUnit.test("Text question localization properties", function(assert) {
  var question = new Survey.QuestionText("q1");
  var group = new TranslationGroup(question.name, question);
  assert.ok(
    group.items.length >= 5,
    "There are five or more localization strings"
  );
});
QUnit.test("Survey child groups", function(assert) {
  var survey = new Survey.Survey();
  var group = new TranslationGroup("root", survey);
  assert.equal(group.groups.length, 0, "There is no any group yet");
  survey.addNewPage("p1");
  group.reset();
  assert.equal(group.groups.length, 1, "one page is added");
  assert.equal(group.groups[0].groups.length, 0, "no questions");
  survey.pages[0].addNewQuestion("text", "q1");
  group.reset();
  assert.equal(group.groups.length, 1, "questions should not be there");
  assert.equal(group.groups[0].groups.length, 1, "page has one question");
});
QUnit.test("Survey child groups", function(assert) {
  var survey = new Survey.Survey();
  var group = new TranslationGroup("root", survey);
  survey.addNewPage("p1");
  var question = <Survey.QuestionText>(
    survey.pages[0].addNewQuestion("text", "q1")
  );
  var translation = new Translation(survey);
  assert.equal(translation.locales.length, 1, "There is only default locale");
  question.locTitle.setLocaleText("de", "Deutch text");
  translation.reset();
  assert.equal(translation.locales.length, 2, "There are two locales now");
  translation.addLocale("fr");
  translation.addLocale("de");
  assert.equal(translation.locales.length, 3, "There are three locales now");
});
QUnit.test("Localization strings editing", function(assert) {
  var question = new Survey.QuestionText("q1");
  var group = new TranslationGroup(question.name, question);
  var item = <TranslationItem>group.items[0];
  question[item.name] = "textEn";
  var valEnglish = item.koValue("");
  var valFrench = item.koValue("fr");
  assert.equal(valEnglish(), "textEn", "The value was set");
  assert.equal(valFrench(), "", "The value was not set");
  valEnglish("textEnUpdated");
  valFrench("textFranceNew");
  assert.equal(
    question[item.name],
    "textEnUpdated",
    "The english value has been updated"
  );
  assert.equal(
    item.locString.getLocaleText("fr"),
    "textFranceNew",
    "The french value has been updated"
  );
});