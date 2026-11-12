const { test, expect } = require('@playwright/test');
test.beforeEach(async ({ page }) => { await page.goto('/'); });
test('Ergebnisbutton und Grundlohnabweichung',async({page})=>{
 await page.locator('#level').selectOption('2b');
 await page.getByRole('button',{name:'Weiter'}).first().click();
 await page.locator('#tariff').selectOption('dgb');
 await page.locator('#eg').selectOption('2b');
 await page.locator('#base').fill('15,50');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Meinen Lohn prüfen'}).click();
 await expect(page.locator('#result')).toBeVisible();
 await expect(page.locator('#report')).toContainText('0,58');
});
test('Unbekannter Tarif erzeugt keine DGB/GVP-Anspruchsbehauptung',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Meinen Lohn prüfen'}).click();
 await expect(page.locator('#result')).toBeVisible();
 await expect(page.locator('#report')).toContainText('Tarifgeltung');
});
test('Abrechnung 15,80 statt 16,08 ergibt 0,28 Differenz',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#base').fill('16,08');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#s3 summary').click();
 await page.locator('#paid').fill('15,80');
 await page.getByRole('button',{name:'Meinen Lohn prüfen'}).click();
 await expect(page.locator('#report')).toContainText('0,28');
});
test('Ungültige Euroeingabe wird nicht berechnet',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#base').fill('abc');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Meinen Lohn prüfen'}).click();
 await expect(page.locator('#validation')).toContainText('korrigieren');
 await expect(page.locator('#result')).toBeHidden();
});
test('Änderung nach Zurück wird übernommen',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#tariff').selectOption('dgb');
 await page.locator('#eg').selectOption('2b');
 await page.locator('#base').fill('15,50');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Meinen Lohn prüfen'}).click();
 await expect(page.locator('#report')).toContainText('0,58');
 await page.locator('#s3').getByRole('button',{name:'Zurück'}).click();
 await page.locator('#base').fill('16,08');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Meinen Lohn prüfen'}).click();
 await expect(page.locator('#report')).not.toContainText('0,58');
});

test('Fehlende Angaben bleiben erkennbar',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Meinen Lohn prüfen'}).click();
 await expect(page.locator('#report')).toContainText('fehlen Angaben');
 await expect(page.locator('#report')).toContainText('Tarifgeltung');
});
test('Abweichende Selbsteinschätzung ist keine automatische Höhergruppierung',async({page})=>{
 await page.locator('#level').selectOption('4');
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#tariff').selectOption('dgb');
 await page.locator('#eg').selectOption('1');
 await page.locator('#base').fill('15,33');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Meinen Lohn prüfen'}).click();
 await expect(page.locator('#report')).toContainText('weicht von deiner Selbsteinschätzung');
 await expect(page.locator('#report')).toContainText('keine tarifliche Eingruppierung');
});
test('Zulagen werden nicht ungeprüft addiert',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#tariff').selectOption('dgb');
 await page.locator('#eg').selectOption('2b');
 await page.locator('#base').fill('16,08');
 await page.locator('#s2 summary').click();
 await page.locator('#branch').fill('1,20');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Meinen Lohn prüfen'}).click();
 await expect(page.locator('#report')).toContainText('Zulagen und mögliche Anrechnungen separat prüfen');
 await expect(page.locator('#report')).not.toContainText('17,28');
});
test('Negativer Betrag wird abgewiesen',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#base').fill('-1');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Meinen Lohn prüfen'}).click();
 await expect(page.locator('#validation')).toContainText('korrigieren');
});
test('Zu viele Nachkommastellen werden abgewiesen',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#base').fill('16,081');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Meinen Lohn prüfen'}).click();
 await expect(page.locator('#validation')).toContainText('korrigieren');
});

test('Feedback kann ohne personenbezogene Pflichtangaben vorbereitet werden',async({page})=>{
 await page.locator('#fbRating').selectOption('Hilfreich');
 await page.locator('#fbTopic').selectOption('Ich habe einen Verbesserungsvorschlag');
 await page.locator('#fbText').fill('Bitte mehr Beispiele für Tätigkeiten.');
 await page.getByRole('button',{name:'Feedback über GitHub senden'}).click();
 await expect(page.locator('#fbStatus')).toContainText('öffentlich');
});
test('Neue Einstiegstexte erklären Nutzen und Grenzen',async({page})=>{
 await expect(page.getByRole('heading',{name:'Machst du mehr, als du bezahlt bekommst?'})).toBeVisible();
 await expect(page.locator('#s1')).toContainText('keine tarifliche Eingruppierung');
});
