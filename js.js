/**
 * Core Repository Utilities & Helper Library
 * Standard operational utilities for data manipulation, async processing, and math.
 */

class DataStructureUtils {
  /**
   * Deeply clones a JavaScript object or array using recursive traversal.
   * @param {Object|Array} obj - Item to clone.
   * @returns {Object|Array} Deep copy of the item.
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof RegExp) return new RegExp(obj);
    if (Array.isArray(obj)) return obj.map((item) => this.deepClone(item));

    const clonedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = this.deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  /**
   * Flattens a deeply nested array up to a specified depth.
   * @param {Array} arr - Nested array.
   * @param {number} depth - Flatten depth limit.
   * @returns {Array} Flattened array.
   */
  static flattenArray(arr, depth = 1) {
    return depth > 0
      ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flattenArray(val, depth - 1) : val), [])
      : arr.slice();
  }

  /**
   * Removes duplicate elements from an array of primitives or objects by key.
   * @param {Array} arr - Target array.
   * @param {string} [key] - Optional object key to compare by.
   * @returns {Array} Array with unique elements.
   */
  static unique(arr, key = null) {
    if (!key) return [...new Set(arr)];
    const seen = new Set();
    return arr.filter((item) => {
      const k = item[key];
      return seen.has(k) ? false : seen.add(k);
    });
  }

  /**
   * Groups array elements by a specified key or evaluation function.
   * @param {Array} arr - Items to group.
   * @param {string|Function} fn - Property name or evaluator function.
   * @returns {Object} Grouped key-value map.
   */
  static groupBy(arr, fn) {
    return arr.reduce((acc, item) => {
      const key = typeof fn === 'function' ? fn(item) : item[fn];
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }
}

class AsyncUtils {
  /**
   * Pauses execution for a specified duration in milliseconds.
   * @param {number} ms - Milliseconds to delay.
   * @returns {Promise<void>}
   */
  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retries an async function a specified number of times before failing.
   * @param {Function} fn - Async action returning a Promise.
   * @param {number} retries - Number of retry attempts.
   * @param {number} delay - Delay between retries in ms.
   * @returns {Promise<*>} Result of the execution.
   */
  static async retry(fn, retries = 3, delay = 1000) {
    try {
      return await fn();
    } catch (err) {
      if (retries <= 1) throw err;
      await this.sleep(delay);
      return this.retry(fn, retries - 1, delay);
    }
  }

  /**
   * Batches an array of async tasks and runs them with limited concurrency.
   * @param {Array<Function>} tasks - Array of promise-returning functions.
   * @param {number} limit - Maximum concurrent executions.
   * @returns {Promise<Array>} Results array.
   */
  static async pool(tasks, limit = 5) {
    const results = [];
    const executing = [];

    for (const task of tasks) {
      const p = Promise.resolve().then(() => task());
      results.push(p);

      if (limit <= tasks.length) {
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        if (executing.length >= limit) {
          await Promise.race(executing);
        }
      }
    }

    return Promise.all(results);
  }
}

class StringUtils {
  /**
   * Converts a string into kebab-case.
   * @param {string} str - Raw input string.
   * @returns {string} Kebab-cased string.
   */
  static toKebabCase(str) {
    return str
      ?.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map((x) => x.toLowerCase())
      ?.join('-') || '';
  }

  /**
   * Converts a string into camelCase.
   * @param {string} str - Raw input string.
   * @returns {string} Camel-cased string.
   */
  static toCamelCase(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  }

  /**
   * Truncates a string to a specified max length, adding ellipses.
   * @param {string} str - String to truncate.
   * @param {number} maxLength - Character limit.
   * @returns {string} Truncated string.
   */
  static truncate(str, maxLength = 100) {
    if (!str || str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
  }
}

class MathUtils {
  /**
   * Generates a random integer within an inclusive range.
   * @param {number} min - Lower bound.
   * @param {number} max - Upper bound.
   * @returns {number} Random integer.
   */
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Clamps a value between a lower and upper limit.
   * @param {number} val - Input number.
   * @param {number} min - Minimum value allowed.
   * @param {number} max - Maximum value allowed.
   * @returns {number} Clamped number.
   */
  static clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /**
   * Normalizes a value to a range between 0 and 1.
   * @param {number} val - Value to normalize.
   * @param {number} min - Range minimum.
   * @param {number} max - Range maximum.
   * @returns {number} Value between 0 and 1.
   */
  static normalize(val, min, max) {
    return (val - min) / (max - min);
  }
}

export { DataStructureUtils, AsyncUtils, StringUtils, MathUtils };