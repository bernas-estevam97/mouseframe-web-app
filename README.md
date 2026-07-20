# **MouseFrame**

MouseFrame is a digital analysis tool designed to evaluate the walking patterns (gait) of murine models. By replacing the exhaustive manual measurement of footprints with a streamlined digital interface, MouseFrame facilitates comparative studies between healthy subjects and models of neurodegenerative or motor function diseases. 

Historically, scientists paint mice paws, allow them to walk across a strip of paper, and measure each footstep by hand using a ruler. MouseFrame digitizes and automates this process, requiring only a scanned image of the footprint paper to extract precise spatial data.

![Example of a digitalized footprint sheet](https://github.com/user-attachments/assets/e2a2e9a8-a5ec-4ac7-9bf2-8f45d67a7f60)

---

## **System Requirements & Access**

MouseFrame is optimized exclusively for desktop and laptop displays. Mobile devices and tablets are not supported due to the high level of precision required for spatial annotation. 

| Account Type | Capabilities | Limitations |
| :--- | :--- | :--- |
| **Registered User** | Save calibration data for longitudinal studies. Saved values populate automatically in dropdown menus for future sessions. | Requires account creation. |
| **Guest User** | Trial all core application features. | Cannot save calibration values to the database. Must calibrate manually during every session. |

---

## **Workflow Overview**

1. **Image Preparation:** Scan the footprint sheets at a consistent DPI to ensure uniform image resolution. Draw a visible 1 cm reference line on at least one sheet per batch prior to scanning to serve as a spatial anchor. If hardware changes occur, you must recalibrate the pixel-to-centimetre ratio with a new reference line.
2. **Upload & Sizing:** Upload the footprint images within the Analysis page workspace. Adjust the image size for comfortable viewing using the interface slider or by holding the `Z` key and pressing `+` or `-`. Keep your working zoom level consistent, as the image scaling percentage is recorded and directly affects spatial calibration.
3. **Spatial Calibration:** Define the pixel representation of one physical centimetre. Click the `+` button to activate the tool and mark the start and end points of your 1 cm reference line. Click the **Ruler** button to calculate the exact pixel distance. You may also manually input a known calibration ratio. 
4. **Point Annotation:** Mark the exact paw placements on the digitized sheet. Choose a point size before starting to maintain visual consistency. Activate a specific paw by clicking the mouse schematic or using keyboard shortcuts. You can replace individual points or delete entire groups dynamically from the active list.
5. **Data Extraction:** In the Data Management module, input a table title (e.g., animal identifier) and specify the left-to-right sequence of the initial footstep pair. Choose to extract raw pixel relationships or physical measurements in centimetres. The generated table includes entry numbers, measurement types, values, and scaling percentages.
6. **Data Export:** Curate the table by deleting specific rows or measurement types. Export the finalized dataset directly to a Microsoft Excel file or copy it to the system clipboard.

---

## **Measurements & Coordinate System**

MouseFrame tracks footprints using a specific color-coding system and analyzes 8 distinct types of measurements to evaluate motor function.

* **Front Paws:** Marked in Red
* **Hind Paws:** Marked in Blue

![MouseFrame measurement guidelines and coordinate system](https://github.com/user-attachments/assets/7c391d47-9a15-4906-b722-f4613e643e86)

### **2D Graph Mapping Logic**
The application uses a strict 2D coordinate plane to map the annotated footsteps:
* **Origin (0,0):** Located at the top-left corner of every image.
* **X-Axis:** Values increase from left to right.
* **Y-Axis:** Values increase from top to bottom.

*(Note: Detailed mathematical breakdowns of how each of the 8 specific measurements is calculated can be found on the built-in Info Page within the application.)*

---

## **External Resources**
* **Application Website:** [https://mouseframe.pt/](https://mouseframe.pt/)
* **Contact & Support:** <mouseframe.app@gmail.com> or <bernaz.estevam97@gmail.com>
