const { test, expect } = require('@playwright/test');
test.beforeEach(async ({ page }) => { await page.goto('/'); });
test('Ergebnisbutton und Grundlohnabweichung',async({page})=>{
 await page.locator('#level').selectOption('2b');
 await page.getByRole('button',{name:'Weiter'}).first().click();
 await page.locator('#tariff').selectOption('dgb');
 await page.locator('#eg').selectOption('2b');
 await page.locator('#base').fill('15,50');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Ergebnis anzeigen'}).click();
 await expect(page.locator('#result')).toBeVisible();
 await expect(page.locator('#report')).toContainText('0,58');
});
test('Unbekannter Tarif erzeugt keine DGB/GVP-Anspruchsbehauptung',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Ergebnis anzeigen'}).click();
 await expect(page.locator('#result')).toBeVisible();
 await expect(page.locator('#report')).toContainText('Tarifgeltung');
});
test('Abrechnung 15,80 statt 16,08 ergibt 0,28 Differenz',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#base').fill('16,08');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#s3 summary').click();
 await page.locator('#paid').fill('15,80');
 await page.getByRole('button',{name:'Ergebnis anzeigen'}).click();
 await expect(page.locator('#report')).toContainText('0,28');
});
test('Ungültige Euroeingabe wird nicht berechnet',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#base').fill('abc');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Ergebnis anzeigen'}).click();
 await expect(page.locator('#validation')).toContainText('korrigieren');
 await expect(page.locator('#result')).toBeHidden();
});
test('Änderung nach Zurück wird übernommen',async({page})=>{
 await page.locator('#s1').getByRole('button',{name:'Weiter'}).click();
 await page.locator('#tariff').selectOption('dgb');
 await page.locator('#eg').selectOption('2b');
 await page.locator('#base').fill('15,50');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Ergebnis anzeigen'}).click();
 await expect(page.locator('#report')).toContainText('0,58');
 await page.locator('#s3').getByRole('button',{name:'Zurück'}).click();
 await page.locator('#base').fill('16,08');
 await page.locator('#s2').getByRole('button',{name:'Weiter'}).click();
 await page.getByRole('button',{name:'Ergebnis anzeigen'}).click();
 await expect(page.locator('#report')).not.toContainText('0,58');
});
