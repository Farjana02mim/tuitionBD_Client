/**
 * Safely format MongoDB IDs, dates, and amounts to prevent React 
 * "Objects are not valid as a React child" errors and "Invalid Date"
 */

export const formatMongoId = (id) => {
  if (!id) return '';
  if (typeof id === 'string') return id;
  if (typeof id === 'object') {
    if (id.$oid) return String(id.$oid);
    if (typeof id.toString === 'function' && id.toString() !== '[object Object]') {
      return id.toString();
    }
    return JSON.stringify(id);
  }
  return String(id);
};

export const safeDateString = (dateVal, fallbackDoc = null) => {
  // যদি dateVal খালি থাকে, ডকুমেন্টের বিকল্প তারিখ ফিল্ডগুলো চেক করবে
  if (!dateVal && fallbackDoc && typeof fallbackDoc === 'object') {
    dateVal =
      fallbackDoc.createdAt ||
      fallbackDoc.date ||
      fallbackDoc.paymentDate ||
      fallbackDoc.paidAt ||
      fallbackDoc.timestamp ||
      fallbackDoc.updatedAt;
  }

  let parsedDate = null;

  if (dateVal) {
    try {
      if (typeof dateVal === 'object') {
        if (dateVal.$date) {
          if (typeof dateVal.$date === 'object' && dateVal.$date.$numberLong) {
            parsedDate = new Date(Number(dateVal.$date.$numberLong));
          } else {
            parsedDate = new Date(dateVal.$date);
          }
        } else if (dateVal instanceof Date) {
          parsedDate = dateVal;
        }
      } else if (typeof dateVal === 'number') {
        parsedDate = dateVal < 10000000000 ? new Date(dateVal * 1000) : new Date(dateVal);
      } else if (typeof dateVal === 'string') {
        const trimmed = dateVal.trim();
        if (/^\d{10}$/.test(trimmed)) {
          parsedDate = new Date(Number(trimmed) * 1000);
        } else if (/^\d{13}$/.test(trimmed)) {
          parsedDate = new Date(Number(trimmed));
        } else {
          parsedDate = new Date(trimmed);
        }
      }
    } catch {
      parsedDate = null;
    }
  }

  // তারিখটি ভ্যালিড হলে সুন্দর ফরম্যাটে দেখাবে (e.g. Sep 10, 2026)
  if (parsedDate && !isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // ফলব্যাক: MongoDB _id থেকে আসল তৈরির তারিখ বের করে নেওয়া
  const idToExtract = fallbackDoc?._id || (typeof dateVal === 'string' && /^[0-9a-fA-F]{24}$/.test(dateVal) ? dateVal : null);
  if (idToExtract) {
    try {
      const idStr = formatMongoId(idToExtract);
      if (typeof idStr === 'string' && /^[0-9a-fA-F]{24}$/.test(idStr)) {
        const timestamp = parseInt(idStr.substring(0, 8), 16) * 1000;
        const d = new Date(timestamp);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        }
      }
    } catch {
      // ignore
    }
  }

  return 'N/A';
};