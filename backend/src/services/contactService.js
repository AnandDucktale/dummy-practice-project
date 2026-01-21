import Contact from '../models/Contact.js';
import ApiError from '../utils/ApiError.js';

export const contactsService = async (page, limit, field, contactOwnerId) => {
  const skip = (page - 1) * limit;
  // console.log(contactOwnerId);

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

  //   console.log(contacts);

  const total = await Contact.countDocuments({
    contactOwnerId: contactOwnerId,
  });
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    status: 200,
    message: `Your ${limit} contacts for page number ${page}.`,
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
  contactOwnerId
) => {
  const skip = (page - 1) * limit;
  // console.log(page, limit, search, field, contactOwnerId, skip);

  if (!search.trim() === '') {
    throw new ApiError(400, 'Nothing to search');
  }

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

  // console.log(contacts);

  const total = await Contact.countDocuments(query);

  // if (total === 0) {
  //   return {
  //     success: true,
  //     status: 200,
  //     contacts,
  //     totalContacts: 0,
  //     totalPages: 0,
  //   };
  // }
  return {
    success: true,
    status: 200,
    contacts,
    totalPages: Math.ceil(total / limit),
    total: total,
  };
};

export const contactDetailService = async (contactId) => {
  // console.log(contactId);

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new ApiError(404, 'This contact does not exist');
  }

  // console.log(contact);

  return {
    success: true,
    status: 200,
    contact: contact,
    message: 'Contact Details',
  };
};

export const editContactService = async (name, email, phone, contactId) => {
  // console.log('edit contact');

  // console.log(name);
  // console.log(email);
  // console.log(phone);

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new ApiError(404, 'Contact does not exist');
  }

  contact.name = name;
  contact.email = email;
  contact.phone = phone;

  await contact.save();

  return {
    success: true,
    status: 200,
    message: 'Contact updated',
    contact: contact,
  };
};

export const addContactService = async (
  name,
  email,
  phone,
  age,
  contactOwnerId
) => {
  // console.log(name, email, phone, age);
  // console.log(contactOwnerId);

  const contactCreated = await Contact.create({
    name: name,
    email: email,
    phone: phone,
    age: age,
    contactOwnerId: contactOwnerId,
  });

  // const contactCreated = 'hello';
  return {
    success: true,
    status: 200,
    message: 'Contact Created',
    contactCreated,
  };
};
