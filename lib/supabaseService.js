import { supabase } from './supabase.js'

// Helper to get current user
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ========== CATEGORIES ==========

export const loadCategories = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        subcategories (
          *,
          sections (
            *,
            sentences (
              *,
              sentence_parts (*)
            )
          )
        )
      `)
      .eq('user_id', user.id)
      .order('display_order', { ascending: true })

    if (error) throw error

    // Transform data to match app structure
    return data.map(cat => ({
      id: cat.id,
      title: cat.title,
      description: cat.description || '',
      subcategories: (cat.subcategories || []).map(sub => ({
        id: sub.id,
        title: sub.title,
        sections: (sub.sections || []).map(sec => ({
          id: sec.id,
          title: sec.title,
          sentences: (sec.sentences || []).map(sen => ({
            id: sen.id,
            parts: (sen.sentence_parts || [])
              .sort((a, b) => a.part_order - b.part_order)
              .map(part => ({
                type: part.part_type,
                value: part.part_value || '',
                label: part.part_label || '',
                width: part.part_width || '',
                inputType: part.part_input_type || ''
              }))
          }))
        }))
      }))
    }))
  } catch (error) {
    console.error('Error loading categories:', error)
    return []
  }
}

export const createCategory = async (category) => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('categories')
      .insert({
        id: category.id,
        title: category.title,
        description: category.description || '',
        user_id: user.id,
        display_order: category.display_order || 0
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export const updateCategory = async (categoryId, updates) => {
  try {
    const { error } = await supabase
      .from('categories')
      .update({
        title: updates.title,
        description: updates.description,
        display_order: updates.display_order
      })
      .eq('id', categoryId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export const deleteCategory = async (categoryId) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

export const reorderCategories = async (categories) => {
  try {
    const updates = categories.map((cat, index) => ({
      id: cat.id,
      display_order: index
    }))

    for (const update of updates) {
      await supabase
        .from('categories')
        .update({ display_order: update.display_order })
        .eq('id', update.id)
    }
  } catch (error) {
    console.error('Error reordering categories:', error)
    throw error
  }
}

// ========== SUBCATEGORIES ==========

export const createSubcategory = async (categoryId, subcategory) => {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .insert({
        id: subcategory.id,
        category_id: categoryId,
        title: subcategory.title,
        display_order: subcategory.display_order || 0
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating subcategory:', error)
    throw error
  }
}

export const updateSubcategory = async (subcategoryId, updates) => {
  try {
    const { error } = await supabase
      .from('subcategories')
      .update({
        title: updates.title,
        display_order: updates.display_order
      })
      .eq('id', subcategoryId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating subcategory:', error)
    throw error
  }
}

export const deleteSubcategory = async (subcategoryId) => {
  try {
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', subcategoryId)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting subcategory:', error)
    throw error
  }
}

export const reorderSubcategories = async (subcategories) => {
  try {
    for (let i = 0; i < subcategories.length; i++) {
      await supabase
        .from('subcategories')
        .update({ display_order: i })
        .eq('id', subcategories[i].id)
    }
  } catch (error) {
    console.error('Error reordering subcategories:', error)
    throw error
  }
}

// ========== SECTIONS ==========

export const createSection = async (subcategoryId, section) => {
  try {
    const { data, error } = await supabase
      .from('sections')
      .insert({
        id: section.id,
        subcategory_id: subcategoryId,
        title: section.title,
        display_order: section.display_order || 0
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating section:', error)
    throw error
  }
}

export const updateSection = async (sectionId, updates) => {
  try {
    const { error } = await supabase
      .from('sections')
      .update({
        title: updates.title,
        display_order: updates.display_order
      })
      .eq('id', sectionId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating section:', error)
    throw error
  }
}

export const deleteSection = async (sectionId) => {
  try {
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', sectionId)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting section:', error)
    throw error
  }
}

// ========== SENTENCES ==========

export const createSentence = async (sectionId, sentence) => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.warn('User not authenticated, skipping Supabase create')
      return sentence // Return the sentence object as-is if not authenticated
    }

    // Create sentence
    const { data: sentenceData, error: sentenceError } = await supabase
      .from('sentences')
      .insert({
        id: sentence.id,
        section_id: sectionId,
        display_order: sentence.display_order || 0
      })
      .select()
      .single()

    if (sentenceError) throw sentenceError

    // Create sentence parts
    if (sentence.parts && sentence.parts.length > 0) {
      const parts = sentence.parts.map((part, index) => ({
        sentence_id: sentence.id,
        part_order: index,
        part_type: part.type,
        part_value: part.value || '',
        part_label: part.label || '',
        part_width: part.width || '',
        part_input_type: part.inputType || ''
      }))

      const { error: partsError } = await supabase
        .from('sentence_parts')
        .insert(parts)

      if (partsError) throw partsError
    }

    return sentenceData
  } catch (error) {
    console.error('Error creating sentence:', error)
    // Don't throw error if user is not authenticated - allow app to continue working
    if (error.message && error.message.includes('JWT')) {
      console.warn('Authentication error, continuing without Supabase sync')
      return sentence
    }
    throw error
  }
}

export const updateSentence = async (sentenceId, sentence) => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.warn('User not authenticated, skipping Supabase update')
      return // Skip Supabase update if user not authenticated
    }

    // Update sentence order if needed
    if (sentence.display_order !== undefined) {
      const { error: orderError } = await supabase
        .from('sentences')
        .update({ display_order: sentence.display_order })
        .eq('id', sentenceId)

      if (orderError) throw orderError
    }

    // Delete existing parts
    const { error: deleteError } = await supabase
      .from('sentence_parts')
      .delete()
      .eq('sentence_id', sentenceId)

    if (deleteError) throw deleteError

    // Insert new parts
    if (sentence.parts && sentence.parts.length > 0) {
      const parts = sentence.parts.map((part, index) => ({
        sentence_id: sentenceId,
        part_order: index,
        part_type: part.type,
        part_value: part.value || '',
        part_label: part.label || '',
        part_width: part.width || '',
        part_input_type: part.inputType || ''
      }))

      const { error: insertError } = await supabase
        .from('sentence_parts')
        .insert(parts)

      if (insertError) throw insertError
    }
  } catch (error) {
    console.error('Error updating sentence:', error)
    // Don't throw error if user is not authenticated - allow app to continue working
    if (error.message && error.message.includes('JWT')) {
      console.warn('Authentication error, continuing without Supabase sync')
      return
    }
    throw error
  }
}

export const deleteSentence = async (sentenceId) => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.warn('User not authenticated, skipping Supabase delete')
      return // Skip Supabase delete if user not authenticated
    }

    const { error } = await supabase
      .from('sentences')
      .delete()
      .eq('id', sentenceId)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting sentence:', error)
    // Don't throw error if user is not authenticated - allow app to continue working
    if (error.message && error.message.includes('JWT')) {
      console.warn('Authentication error, continuing without Supabase sync')
      return
    }
    throw error
  }
}

export const reorderSentences = async (sectionId, sentences) => {
  try {
    for (let i = 0; i < sentences.length; i++) {
      await supabase
        .from('sentences')
        .update({ display_order: i })
        .eq('id', sentences[i].id)
        .eq('section_id', sectionId)
    }
  } catch (error) {
    console.error('Error reordering sentences:', error)
    throw error
  }
}

// ========== SAVE ENTIRE STRUCTURE ==========

export const saveFullStructure = async (categories) => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    // This is a comprehensive save that handles the entire structure
    // Used when making multiple changes at once
    for (let catIndex = 0; catIndex < categories.length; catIndex++) {
      const cat = categories[catIndex]
      
      // Upsert category
      const { error: catError } = await supabase
        .from('categories')
        .upsert({
          id: cat.id,
          title: cat.title,
          description: cat.description || '',
          user_id: user.id,
          display_order: catIndex
        }, { onConflict: 'id' })

      if (catError) throw catError

      // Handle subcategories
      for (let subIndex = 0; subIndex < (cat.subcategories || []).length; subIndex++) {
        const sub = cat.subcategories[subIndex]
        
        const { error: subError } = await supabase
          .from('subcategories')
          .upsert({
            id: sub.id,
            category_id: cat.id,
            title: sub.title,
            display_order: subIndex
          }, { onConflict: 'id' })

        if (subError) throw subError

        // Handle sections
        for (let secIndex = 0; secIndex < (sub.sections || []).length; secIndex++) {
          const sec = sub.sections[secIndex]
          
          const { error: secError } = await supabase
            .from('sections')
            .upsert({
              id: sec.id,
              subcategory_id: sub.id,
              title: sec.title,
              display_order: secIndex
            }, { onConflict: 'id' })

          if (secError) throw secError

          // Handle sentences
          for (let senIndex = 0; senIndex < (sec.sentences || []).length; senIndex++) {
            const sen = sec.sentences[senIndex]
            
            const { error: senError } = await supabase
              .from('sentences')
              .upsert({
                id: sen.id,
                section_id: sec.id,
                display_order: senIndex
              }, { onConflict: 'id' })

            if (senError) throw senError

            // Delete existing parts
            await supabase
              .from('sentence_parts')
              .delete()
              .eq('sentence_id', sen.id)

            // Insert new parts
            if (sen.parts && sen.parts.length > 0) {
              const parts = sen.parts.map((part, partIndex) => ({
                sentence_id: sen.id,
                part_order: partIndex,
                part_type: part.type,
                part_value: part.value || '',
                part_label: part.label || '',
                part_width: part.width || '',
                part_input_type: part.inputType || ''
              }))

              const { error: partsError } = await supabase
                .from('sentence_parts')
                .insert(parts)

              if (partsError) throw partsError
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error saving full structure:', error)
    throw error
  }
}

