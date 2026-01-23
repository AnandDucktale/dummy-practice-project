import ApiError from '../utils/ApiError.js';

import Contact from '../models/Contact.js';

export const contactsService = async (page, limit, field, contactOwnerId) => {
  const skip = (page - 1) * limit;

  let contacts;

  if (field === 'phone') {
    contacts = await Contact.find({ contactOwnerId: contactOwnerId })
      .sort({
        phone: 1,
      })
      .skip(skip)
      .limit(limit);
  } else if (field === 'email') {
    contacts = await Contact.find({ contactOwnerId: contactOwnerId })
      .sort({
        email: 1,
      })
      .skip(skip)
      .limit(limit);
  } else if (field === 'name') {
    contacts = await Contact.find({ contactOwnerId: contactOwnerId })
      .sort({
        name: 1,
      })
      .skip(skip)
      .limit(limit);
  } else {
    contacts = await Contact.find({ contactOwnerId: contactOwnerId })
      .skip(skip)
      .limit(limit);
  }

  const total = await Contact.countDocuments({
    contactOwnerId: contactOwnerId,
  });
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    contacts,
  };
};

export const searchContactsService = async (
  page,
  limit,
  field,
  search,
  contactOwnerId,
) => {
  const skip = (page - 1) * limit;

  const query = {
    contactOwnerId: contactOwnerId,
    $or: [
      { name: { $regex: `^${search}`, $options: 'i' } },
      { email: { $regex: `^${search}`, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ],
  };

  let contacts;

  if (field === 'phone') {
    contacts = await Contact.find({ phone: { $regex: search, $options: 'i' } })
      .sort({ phone: 1 })
      .skip(skip)
      .limit(limit);
  } else if (field === 'email') {
    contacts = await Contact.find({
      email: { $regex: `^${search}`, $options: 'i' },
    })
      .sort({ email: 1 })
      .skip(skip)
      .limit(limit);
  } else if (field === 'name') {
    contacts = await Contact.find({
      email: { $regex: `^${search}`, $options: 'i' },
    })
      .sort({ email: 1 })
      .skip(skip)
      .limit(limit);
  } else {
    contacts = await Contact.find(query).skip(skip).limit(limit);
  }

  const total = await Contact.countDocuments(query);

  return {
    contacts,
    totalPages: Math.ceil(total / limit),
    total: total,
  };
};

export const contactDetailService = async (contactId) => {
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new ApiError(404, 'This contact does not exist');
  }

  return {
    contact: contact,
  };
};

export const editContactService = async (name, email, phone, contactId) => {
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new ApiError(404, 'Contact does not exist');
  }

  contact.name = name;
  contact.email = email;
  contact.phone = phone;

  await contact.save();

  return {
    contact: contact,
  };
};

export const addContactService = async (
  name,
  email,
  phone,
  age,
  contactOwnerId,
) => {
  const contactCreated = await Contact.create({
    name: name,
    email: email,
    phone: phone,
    age: age,
    contactOwnerId: contactOwnerId,
  });

  return {
    contactCreated,
  };
};
