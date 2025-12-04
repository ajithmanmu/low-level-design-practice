import { FigmaDocument } from "./Document";
import { Layer } from "./Layer";

console.log("=== Figma Document Undo/Redo Test ===\n");

// Test 1: Basic Apply and Undo
console.log("Test 1: Basic Apply and Undo");
const doc1 = new FigmaDocument("Test Doc 1");
const layer1 = new Layer("layer1", "Rectangle");
layer1.setProperty("x", 10); // Set initial value
doc1.addLayer(layer1);

doc1.apply({ layerId: "layer1", key: "x", value: 50 }); // Change to 50
console.log(`   After apply: x = ${doc1.layerById("layer1").getProperty("x")} (expected: 50)`);

doc1.undo(); // Should revert to 10
console.log(`   After undo: x = ${doc1.layerById("layer1").getProperty("x")} (expected: 10)`);
console.log(doc1.layerById("layer1").getProperty("x") === 10 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 2: Undo and Redo
console.log("Test 2: Undo and Redo");
const doc2 = new FigmaDocument("Test Doc 2");
const layer2 = new Layer("layer2", "Circle");
layer2.setProperty("x", 100);
doc2.addLayer(layer2);

doc2.apply({ layerId: "layer2", key: "x", value: 200 });
console.log(`   After apply: x = ${doc2.layerById("layer2").getProperty("x")} (expected: 200)`);

doc2.undo();
console.log(`   After undo: x = ${doc2.layerById("layer2").getProperty("x")} (expected: 100)`);

doc2.redo();
console.log(`   After redo: x = ${doc2.layerById("layer2").getProperty("x")} (expected: 200)`);
console.log(doc2.layerById("layer2").getProperty("x") === 200 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 3: New change clears redo stack
console.log("Test 3: New change clears redo stack");
const doc3 = new FigmaDocument("Test Doc 3");
const layer3 = new Layer("layer3", "Square");
layer3.setProperty("x", 10);
doc3.addLayer(layer3);

doc3.apply({ layerId: "layer3", key: "x", value: 20 });
doc3.apply({ layerId: "layer3", key: "x", value: 30 });
doc3.undo(); // x = 20
console.log(`   After undo: x = ${doc3.layerById("layer3").getProperty("x")} (expected: 20)`);

doc3.apply({ layerId: "layer3", key: "x", value: 100 }); // New change - clears redo stack
console.log(`   After new apply: x = ${doc3.layerById("layer3").getProperty("x")} (expected: 100)`);

doc3.redo(); // Should do nothing (redo stack cleared)
console.log(`   After redo: x = ${doc3.layerById("layer3").getProperty("x")} (expected: 100 - redo does nothing)`);
console.log(doc3.layerById("layer3").getProperty("x") === 100 ? "✅ PASS - Redo stack cleared\n" : "❌ FAIL\n");

// Test 4: Multiple operations
console.log("Test 4: Multiple operations");
const doc4 = new FigmaDocument("Test Doc 4");
const layer4 = new Layer("layer4", "Rectangle");
layer4.setProperty("x", 10);
layer4.setProperty("y", 20);
doc4.addLayer(layer4);

doc4.apply({ layerId: "layer4", key: "x", value: 50 });
doc4.apply({ layerId: "layer4", key: "y", value: 60 });
console.log(`   After 2 applies: x=${doc4.layerById("layer4").getProperty("x")}, y=${doc4.layerById("layer4").getProperty("y")}`);

doc4.undo(); // Undo y change
console.log(`   After undo y: x=${doc4.layerById("layer4").getProperty("x")}, y=${doc4.layerById("layer4").getProperty("y")} (expected: x=50, y=20)`);

doc4.undo(); // Undo x change
console.log(`   After undo x: x=${doc4.layerById("layer4").getProperty("x")}, y=${doc4.layerById("layer4").getProperty("y")} (expected: x=10, y=20)`);

const xVal = doc4.layerById("layer4").getProperty("x");
const yVal = doc4.layerById("layer4").getProperty("y");
console.log(xVal === 10 && yVal === 20 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 5: Property that doesn't exist initially
console.log("Test 5: Property that doesn't exist initially");
const doc5 = new FigmaDocument("Test Doc 5");
const layer5 = new Layer("layer5", "New Layer");
doc5.addLayer(layer5);

doc5.apply({ layerId: "layer5", key: "x", value: 100 }); // Create new property
console.log(`   After apply: x = ${doc5.layerById("layer5").getProperty("x")} (expected: 100)`);

doc5.undo(); // Should revert to null (property didn't exist)
const finalX = doc5.layerById("layer5").getProperty("x");
console.log(`   After undo: x = ${finalX} (expected: null)`);
console.log(finalX === null ? "✅ PASS\n" : "❌ FAIL\n");

console.log("=== All Tests Complete ===");
