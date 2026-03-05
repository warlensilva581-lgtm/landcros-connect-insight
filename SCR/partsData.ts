export interface Part {
  id: string;
  sheet: string;
  category: string;
  itemNumber: string;
  partNumber: string;
  description: string;
}

export const PARTS_DATA: Part[] = [
  // SHEET 02 - FUEL PIPINGS
  { id: 'f1', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '00', partNumber: 'YA00049099', description: 'Fuel Hose (00)' },
  { id: 'f2', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '01', partNumber: 'YA00052211', description: 'Fuel Hose (20)' },
  { id: 'f3', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '02', partNumber: 'YA00052213', description: 'Fuel Hose (02)' },
  { id: 'f4', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '03', partNumber: 'YA00049132', description: 'Fuel Hose (04)' },
  { id: 'f5', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '04', partNumber: '4639391', description: 'Fuel Hose (00)' },
  { id: 'f6', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '05', partNumber: 'YA00049131', description: 'Fuel Hose (03)' },

  // SHEET 03 - FUEL COOLER PIPING
  { id: 'fc1', sheet: '03', category: 'FUEL COOLER PIPING', itemNumber: '00', partNumber: 'YA60049445', description: 'Cooler Hose (64)' },
  { id: 'fc2', sheet: '03', category: 'FUEL COOLER PIPING', itemNumber: '01', partNumber: 'YA00052210', description: 'Cooler Hose (54)' },
  { id: 'fc3', sheet: '03', category: 'FUEL COOLER PIPING', itemNumber: '02', partNumber: 'YA00052209', description: 'Cooler Hose (53)' },
  { id: 'fc4', sheet: '03', category: 'FUEL COOLER PIPING', itemNumber: '03', partNumber: 'YA60049444', description: 'Cooler Hose (63)' },

  // SHEET 04 - SUCTION PIPINGS
  { id: 's1', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '00', partNumber: '4193871', description: 'Suction Hose (06)' },
  { id: 's2', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '01', partNumber: 'YA00051594', description: 'Suction Hose (21)' },
  { id: 's3', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '02', partNumber: 'YA00051595', description: 'Suction Hose (22)' },
  { id: 's4', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '03', partNumber: '4204186', description: 'Suction Hose (23)' },
  { id: 's5', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '04', partNumber: '4204186', description: 'Suction Hose (23)' },
  { id: 's6', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '05', partNumber: '4441963', description: 'Suction Hose (25)' },
  { id: 's7', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '06', partNumber: '4441961', description: 'Suction Hose (24)' },
  { id: 's8', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '07', partNumber: '4442830', description: 'Suction Hose (26)' },

  // SHEET 05 - TRANSMISSION COOLER PIPINGS (1)
  { id: 'tc1_1', sheet: '05', category: 'TRANSMISSION COOLER PIPINGS (1)', itemNumber: '00', partNumber: 'YA60048807', description: 'Cooler Hose (07)' },
  { id: 'tc1_2', sheet: '05', category: 'TRANSMISSION COOLER PIPINGS (1)', itemNumber: '01', partNumber: 'YA60048808', description: 'Cooler Hose (08)' },

  // SHEET 06 - TRANSMISSION COOLER PIPINGS (2)
  { id: 'tc2_1', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '00', partNumber: '4684745', description: 'Cooler Hose (11)' },
  { id: 'tc2_2', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '01', partNumber: '4641112', description: 'Cooler Hose (10)' },
  { id: 'tc2_3', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '02', partNumber: 'YA00008490', description: 'Cooler Hose (12)' },
  { id: 'tc2_4', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '03', partNumber: '4365395', description: 'Cooler Hose (16)' },
  { id: 'tc2_5', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '04', partNumber: '4251907', description: 'Cooler Hose (15)' },
  { id: 'tc2_6', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '05', partNumber: '4207388', description: 'Cooler Hose (65)' },
  { id: 'tc2_7', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '06', partNumber: '4690164', description: 'Cooler Hose (57)' },

  // SHEET 07 - DELIVERY PIPINGS
  { id: 'd1', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '00', partNumber: 'YA00055740', description: 'Delivery Hose (00)' },
  { id: 'd2', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '01', partNumber: '4671626', description: 'Delivery Hose (00)' },
  { id: 'd3', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '02', partNumber: '4612007', description: 'Delivery Hose (04)' },
  { id: 'd4', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '03', partNumber: '4441543', description: 'Delivery Hose (08)' },
  { id: 'd5', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '04', partNumber: 'XV00003658', description: 'Delivery Hose (02)' },
  { id: 'd6', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '05', partNumber: '4622750', description: 'Delivery Hose (32)' },
  { id: 'd7', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '06', partNumber: '4622750', description: 'Delivery Hose (32)' },
  { id: 'd8', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '07', partNumber: '4622750', description: 'Delivery Hose (32)' },

  // SHEET 08 - DRAIN PIPINGS
  { id: 'dr1', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '00', partNumber: 'YA60053819', description: 'Drain Hose (35)' },
  { id: 'dr2', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '01', partNumber: 'YA60053816', description: 'Drain Hose (34)' },
  { id: 'dr3', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '02', partNumber: 'YA60053815', description: 'Drain Hose (33)' },
  { id: 'dr4', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '03', partNumber: '4678497', description: 'Drain Hose (22)' },
  { id: 'dr5', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '04', partNumber: '4680278', description: 'Drain Hose (20)' },
  { id: 'dr6', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '05', partNumber: '4354655', description: 'Drain Hose (19)' },
  { id: 'dr7', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '06', partNumber: '4639926', description: 'Drain Hose (21)' },
  { id: 'dr8', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '07', partNumber: 'XV00003682', description: 'Drain Hose (23)' },
  { id: 'dr9', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '08', partNumber: '4217389', description: 'Drain Hose (24)' },
  { id: 'dr10', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '09', partNumber: 'XV00003681', description: 'Drain Hose (25)' },

  // SHEET 09 - FAN DRIVE PIPINGS
  { id: 'fd1', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '00', partNumber: '4673494', description: 'Fan Drive Hose (38)' },
  { id: 'fd2', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '01', partNumber: '4414656', description: 'Fan Drive Hose (05)' },
  { id: 'fd3', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '02', partNumber: 'YA60048930', description: 'Fan Drive Hose (00)' },
  { id: 'fd4', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '03', partNumber: '4687691', description: 'Fan Drive Hose (03)' },
  { id: 'fd5', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '04', partNumber: 'XV00003878', description: 'Fan Drive Hose (04)' },
  { id: 'fd6', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '05', partNumber: '4640837', description: 'Fan Drive Hose (14)' },
  { id: 'fd7', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '06', partNumber: '4227025', description: 'Fan Drive Hose (18)' },
  { id: 'fd8', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '07', partNumber: 'XV00003677', description: 'Fan Drive Hose (29)' },
  { id: 'fd9', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '08', partNumber: 'XV00003676', description: 'Fan Drive Hose (25)' },
  { id: 'fd10', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '09', partNumber: '4705873', description: 'Fan Drive Hose (26)' },
  { id: 'fd11', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '10', partNumber: '4446905', description: 'Fan Drive Hose (30)' },
  { id: 'fd12', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '11', partNumber: '4685916', description: 'Fan Drive Hose (22)' },
  { id: 'fd13', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '12', partNumber: '4304477', description: 'Fan Drive Hose (27)' },
  { id: 'fd14', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '13', partNumber: 'YA00007517', description: 'Fan Drive Hose (30)' },
  { id: 'fd15', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '14', partNumber: 'YA00007517', description: 'Fan Drive Hose (30)' },

  // SHEET 10 - RETURN PIPINGS
  { id: 'r1', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '00', partNumber: '4067833', description: 'Return Hose (21)' },
  { id: 'r2', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '01', partNumber: '4067833', description: 'Return Hose (21)' },
  { id: 'r3', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '02', partNumber: '4067833', description: 'Return Hose (21)' },
  { id: 'r4', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '03', partNumber: '4067833', description: 'Return Hose (21)' },
  { id: 'r5', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '04', partNumber: '4071214', description: 'Return Hose (22)' },
  { id: 'r6', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '05', partNumber: '4071214', description: 'Return Hose (22)' },
  { id: 'r7', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '06', partNumber: '4071214', description: 'Return Hose (22)' },
  { id: 'r8', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '07', partNumber: '4071215', description: 'Return Hose (23)' },
  { id: 'r9', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '08', partNumber: '4071215', description: 'Return Hose (23)' },
  { id: 'r10', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '09', partNumber: '4071215', description: 'Return Hose (23)' },
  { id: 'r11', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '10', partNumber: '4071215', description: 'Return Hose (23)' },
  { id: 'r12', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '11', partNumber: '4071215', description: 'Return Hose (23)' },

  // SHEET 11 - SWING PIPINGS
  { id: 'sw1', sheet: '11', category: 'SWING PIPINGS', itemNumber: '00', partNumber: '4440424', description: 'Swing Hose (00)' },
  { id: 'sw2', sheet: '11', category: 'SWING PIPINGS', itemNumber: '01', partNumber: '4440424', description: 'Swing Hose (00)' },
  { id: 'sw3', sheet: '11', category: 'SWING PIPINGS', itemNumber: '02', partNumber: '4671800', description: 'Swing Hose (12)' },
  { id: 'sw4', sheet: '11', category: 'SWING PIPINGS', itemNumber: '03', partNumber: '4671800', description: 'Swing Hose (12)' },
  { id: 'sw5', sheet: '11', category: 'SWING PIPINGS', itemNumber: '04', partNumber: '4671801', description: 'Swing Hose (13)' },
  { id: 'sw6', sheet: '11', category: 'SWING PIPINGS', itemNumber: '05', partNumber: '4671801', description: 'Swing Hose (13)' },

  // SHEET 12 - TRAVEL PIPINGS (1)
  { id: 'tr1_1', sheet: '12', category: 'TRAVEL PIPINGS (1)', itemNumber: '00', partNumber: '4651806', description: 'Travel Hose (01)' },
  { id: 'tr1_2', sheet: '12', category: 'TRAVEL PIPINGS (1)', itemNumber: '01', partNumber: 'YA00051569', description: 'Travel Hose (02)' },
  { id: 'tr1_3', sheet: '12', category: 'TRAVEL PIPINGS (1)', itemNumber: '02', partNumber: '4601145', description: 'Travel Hose (00)' },
  { id: 'tr1_4', sheet: '12', category: 'TRAVEL PIPINGS (1)', itemNumber: '03', partNumber: 'YA00051570', description: 'Travel Hose (03)' },

  // SHEET 13 - TRAVEL PIPINGS (2)
  { id: 'tr2_1', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '00', partNumber: '4678995', description: 'Travel Hose (04)' },
  { id: 'tr2_2', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '01', partNumber: '4678995', description: 'Travel Hose (04)' },
  { id: 'tr2_3', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '02', partNumber: '4678995', description: 'Travel Hose (04)' },
  { id: 'tr2_4', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '03', partNumber: '4678995', description: 'Travel Hose (04)' },
  { id: 'tr2_5', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '04', partNumber: '4673041', description: 'Travel Hose (00)' },
  { id: 'tr2_6', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '05', partNumber: '4673041', description: 'Travel Hose (00)' },
  { id: 'tr2_7', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '06', partNumber: '4678796', description: 'Travel Hose (05)' },
  { id: 'tr2_8', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '07', partNumber: '4678796', description: 'Travel Hose (05)' },
  { id: 'tr2_9', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '08', partNumber: '4435992', description: 'Travel Hose (14)' },
  { id: 'tr2_10', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '09', partNumber: '4435992', description: 'Travel Hose (14)' },
  { id: 'tr2_11', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '10', partNumber: '4712781', description: 'Travel Hose (17)' },
  { id: 'tr2_12', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '11', partNumber: '4712781', description: 'Travel Hose (17)' },

  // SHEET 14 - BACKHOE FRONT MAIN PIPINGS
  { id: 'bm1', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '00', partNumber: '4720135', description: 'Main Hose (36)' },
  { id: 'bm2', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '01', partNumber: 'YA00001209', description: 'Main Hose (04)' },
  { id: 'bm3', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '02', partNumber: '4011638', description: 'Main Hose (03)' },
  { id: 'bm4', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '03', partNumber: '4011638', description: 'Main Hose (03)' },
  { id: 'bm5', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '04', partNumber: '4011638', description: 'Main Hose (03)' },

  // SHEET 15 - BACKHOE FRONT PIPINGS (2)
  { id: 'bf2_1', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '00', partNumber: '4720039', description: 'Front Hose (09)' },
  { id: 'bf2_2', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '01', partNumber: 'YA00002206', description: 'Front Hose (08)' },
  { id: 'bf2_3', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '02', partNumber: 'YA00002206', description: 'Front Hose (08)' },
  { id: 'bf2_4', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '03', partNumber: 'YA00002162', description: 'Front Hose (02)' },
  { id: 'bf2_5', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '04', partNumber: 'YA00002162', description: 'Front Hose (02)' },
  { id: 'bf2_6', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '05', partNumber: '4720029', description: 'Front Hose (01)' },
  { id: 'bf2_7', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '06', partNumber: '4720028', description: 'Front Hose (00)' },
  { id: 'bf2_8', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '07', partNumber: '4720037', description: 'Front Hose (07)' },
  { id: 'bf2_9', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '08', partNumber: '4720028', description: 'Front Hose (00)' },
  { id: 'bf2_10', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '09', partNumber: '4720037', description: 'Front Hose (07)' },

  // SHEET 26 - ENGINE STOP SWITCH
  { id: 'es1', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '01', partNumber: 'SWITCH-A', description: 'Engine key switch a' },
  { id: 'es2', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '02', partNumber: 'SWITCH-B', description: 'Engine Stop Switch b' },
  { id: 'es3', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '03', partNumber: 'SWITCH-C', description: 'Engine Stop Switch c' },
  { id: 'es4', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '04', partNumber: 'SWITCH-C', description: 'Engine Stop Switch c (stopped)' },
  { id: 'es5', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '05', partNumber: 'SWITCH-B', description: 'Engine Stop Switch b (stopped)' },
  { id: 'es6', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '06', partNumber: 'SWITCH-A', description: 'Engine key switch a (stopped)' },

  // SHEET 16 - AROUND ENGINE REAR SIDE (ELECTRIC)
  { id: 'e16_1', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '01', partNumber: 'HARNESS-01', description: 'Electric Harness 01' },
  { id: 'e16_2', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '02', partNumber: 'HARNESS-02', description: 'Electric Harness 02' },
  { id: 'e16_3', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '03', partNumber: 'HARNESS-03', description: 'Electric Harness 03' },
  { id: 'e16_4', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '04', partNumber: 'HARNESS-04', description: 'Electric Harness 04' },
  { id: 'e16_5', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '05', partNumber: 'HARNESS-05', description: 'Electric Harness 05' },

  // SHEET 27 - CLEANING THE MACHINE
  { id: 'c27_1', sheet: '27', category: 'CLEANING THE MACHINE', itemNumber: '01', partNumber: 'BATTERY-COMP', description: 'Battery compartment cleaning' },
  { id: 'c27_2', sheet: '27', category: 'CLEANING THE MACHINE', itemNumber: '02', partNumber: 'ENGINE-COMP', description: 'Engine compartment cleaning' },

  // SHEET 17 - HYDRAULIC PUMP PIPINGS
  { id: 'hp1', sheet: '17', category: 'HYDRAULIC PUMP PIPINGS', itemNumber: '01', partNumber: 'YA00001234', description: 'Pump Suction Hose' },
  { id: 'hp2', sheet: '17', category: 'HYDRAULIC PUMP PIPINGS', itemNumber: '02', partNumber: 'YA00001235', description: 'Pump Delivery Hose' },
  { id: 'hp3', sheet: '17', category: 'HYDRAULIC PUMP PIPINGS', itemNumber: '03', partNumber: 'YA00001236', description: 'Pump Drain Hose' },

  // SHEET 18 - CONTROL VALVE PIPINGS
  { id: 'cv1', sheet: '18', category: 'CONTROL VALVE PIPINGS', itemNumber: '01', partNumber: 'YA00002345', description: 'Valve Inlet Hose' },
  { id: 'cv2', sheet: '18', category: 'CONTROL VALVE PIPINGS', itemNumber: '02', partNumber: 'YA00002346', description: 'Valve Outlet Hose' },
  { id: 'cv3', sheet: '18', category: 'CONTROL VALVE PIPINGS', itemNumber: '03', partNumber: 'YA00002347', description: 'Valve Pilot Hose' },

  // SHEET 19 - BOOM CYLINDER PIPINGS
  { id: 'bc1', sheet: '19', category: 'BOOM CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00003456', description: 'Boom Cylinder Hose (Head)' },
  { id: 'bc2', sheet: '19', category: 'BOOM CYLINDER PIPINGS', itemNumber: '02', partNumber: 'YA00003457', description: 'Boom Cylinder Hose (Rod)' },

  // SHEET 20 - ARM CYLINDER PIPINGS
  { id: 'ac1', sheet: '20', category: 'ARM CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00004567', description: 'Arm Cylinder Hose (Head)' },
  { id: 'ac2', sheet: '20', category: 'ARM CYLINDER PIPINGS', itemNumber: '02', partNumber: 'YA00004568', description: 'Arm Cylinder Hose (Rod)' },

  // SHEET 21 - BUCKET CYLINDER PIPINGS
  { id: 'buc1', sheet: '21', category: 'BUCKET CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00005678', description: 'Bucket Cylinder Hose (Head)' },
  { id: 'buc2', sheet: '21', category: 'BUCKET CYLINDER PIPINGS', itemNumber: '02', partNumber: 'YA00005679', description: 'Bucket Cylinder Hose (Rod)' },

  // SHEET 22 - SWING MOTOR PIPINGS
  { id: 'sm1', sheet: '22', category: 'SWING MOTOR PIPINGS', itemNumber: '01', partNumber: 'YA00006789', description: 'Swing Motor Hose (A)' },
  { id: 'sm2', sheet: '22', category: 'SWING MOTOR PIPINGS', itemNumber: '02', partNumber: 'YA00006790', description: 'Swing Motor Hose (B)' },

  // SHEET 23 - TRAVEL MOTOR PIPINGS
  { id: 'tm1', sheet: '23', category: 'TRAVEL MOTOR PIPINGS', itemNumber: '01', partNumber: 'YA00007890', description: 'Travel Motor Hose (Left)' },
  { id: 'tm2', sheet: '23', category: 'TRAVEL MOTOR PIPINGS', itemNumber: '02', partNumber: 'YA00007891', description: 'Travel Motor Hose (Right)' },

  // SHEET 24 - RADIATOR & OIL COOLER
  { id: 'roc1', sheet: '24', category: 'RADIATOR & OIL COOLER', itemNumber: '01', partNumber: 'YA00008901', description: 'Radiator Upper Hose' },
  { id: 'roc2', sheet: '24', category: 'RADIATOR & OIL COOLER', itemNumber: '02', partNumber: 'YA00008902', description: 'Radiator Lower Hose' },
  { id: 'roc3', sheet: '24', category: 'RADIATOR & OIL COOLER', itemNumber: '03', partNumber: 'YA00008903', description: 'Oil Cooler Hose' },

  // SHEET 25 - CABIN & ELECTRIC
  { id: 'ce1', sheet: '25', category: 'CABIN & ELECTRIC', itemNumber: '01', partNumber: 'YA00009012', description: 'Cabin Harness' },
  { id: 'ce2', sheet: '25', category: 'CABIN & ELECTRIC', itemNumber: '02', partNumber: 'YA00009013', description: 'Monitor Unit' },

  // SHEET 28 - UNDERCARRIAGE
  { id: 'uc1', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '01', partNumber: 'YA00010123', description: 'Track Link Assy' },
  { id: 'uc2', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '02', partNumber: 'YA00010124', description: 'Track Roller' },
  { id: 'uc3', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '03', partNumber: 'YA00010125', description: 'Carrier Roller' },
  { id: 'uc4', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '04', partNumber: 'YA00010126', description: 'Idler Assy' },
  { id: 'uc5', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '05', partNumber: 'YA00010127', description: 'Sprocket' },

  // SHEET 29 - BUCKET & TEETH
  { id: 'bt1', sheet: '29', category: 'BUCKET & TEETH', itemNumber: '01', partNumber: 'YA00011234', description: 'Bucket Assy' },
  { id: 'bt2', sheet: '29', category: 'BUCKET & TEETH', itemNumber: '02', partNumber: 'YA00011235', description: 'Bucket Tooth' },
  { id: 'bt3', sheet: '29', category: 'BUCKET & TEETH', itemNumber: '03', partNumber: 'YA00011236', description: 'Tooth Pin' },

  // SHEET 30 - LIGHTS & MIRRORS
  { id: 'lm1', sheet: '30', category: 'LIGHTS & MIRRORS', itemNumber: '01', partNumber: 'YA00012345', description: 'Working Light (Boom)' },
  { id: 'lm2', sheet: '30', category: 'LIGHTS & MIRRORS', itemNumber: '02', partNumber: 'YA00012346', description: 'Working Light (Cab)' },
  { id: 'lm3', sheet: '30', category: 'LIGHTS & MIRRORS', itemNumber: '03', partNumber: 'YA00012347', description: 'Rear View Mirror' },
];
