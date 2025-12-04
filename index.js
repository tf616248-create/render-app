// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.get('/', async (req, res) => {
//   try {
//     const apiKey = process.env.RENDER_API_KEY;
    
//     if (!apiKey) {
//       return res.status(500).json({ error: 'API Key לא מוגדר' });
//     }

//     const response = await fetch('https://api.render.com/v1/services', {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Authorization': `Bearer ${apiKey}`
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`שגיאה: ${response.status}`);
//     }

//     const data = await response.json();
    
//     res.json({
//       סה_כ_שירותים: data.length,
//       שירותים: data.map(service => ({
//         מזהה: service.id,
//         שם: service.name,
//         סוג: service.type,
//         סטטוס: service.suspended ? 'מושהה' : 'פעיל'
//       }))
//     });

//   } catch (error) {
//     console.error('שגיאה:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`השרת רץ על פורט ${PORT}`);
// });


const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const apiKey = process.env.RENDER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key לא מוגדר' });
    }

    console.log('שולח בקשה ל-Render API...');
    
    const response = await fetch('https://api.render.com/v1/services', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`שגיאה: ${response.status}`);
    }

    const data = await response.json();
    
    // הדפס את הנתונים המלאים ללוג
    console.log('נתונים מלאים מ-Render:', JSON.stringify(data, null, 2));
    
    // בדוק אם data הוא מערך או אובייקט
    const services = Array.isArray(data) ? data : (data.services || []);
    
    console.log(`נמצאו ${services.length} שירותים`);
    
    // הצג את כל המידע הזמין על כל שירות
    const detailedServices = services.map(service => {
      console.log('שירות בודד:', JSON.stringify(service, null, 2));
      
      return {
        מזהה: service.id || 'לא זמין',
        שם: service.name || 'ללא שם',
        סוג: service.type || 'לא ידוע',
        סטטוס: service.suspended === 'suspended' ? 'מושהה' : 'פעיל',
        יצירה: service.createdAt || 'לא ידוע',
        עדכון_אחרון: service.updatedAt || 'לא ידוע',
        branch: service.branch || 'לא ידוע',
        region: service.region || 'לא ידוע',
        url: service.serviceDetails?.url || 'אין URL',
        // נתונים מלאים (לבדיקה)
        נתונים_מלאים: service
      };
    });
    
    res.json({
      סה_כ_שירותים: services.length,
      שירותים: detailedServices
    });

  } catch (error) {
    console.error('שגיאה מפורטת:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
});

// נקודת בדיקה נוספת - הצג רק את הנתונים הגולמיים
app.get('/raw', async (req, res) => {
  try {
    const apiKey = process.env.RENDER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key לא מוגדר' });
    }
    
    const response = await fetch('https://api.render.com/v1/services', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const data = await response.json();
    
    // החזר את הנתונים כמו שהם מ-Render
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`השרת רץ על פורט ${PORT}`);
  console.log('נקודות גישה:');
  console.log(`  / - פלט מעובד`);
  console.log(`  /raw - נתונים גולמיים מ-Render`);
});

