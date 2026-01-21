import {
  contactDetailService,
  contactsService,
  searchContactsService,
  editContactService,
  addContactService,
} from '../services/contactService.js';
import ApiError from '../utils/ApiError.js';
import {
  addContactSchema,
  contactDetailSchema,
  contactsSchema,
  editContactSchema,
  searchContactsSchema,
} from '../validations/contact.validation.js';

export const contacts = async (req, res) => {
  try {
    const { error } = contactsSchema.validate({
      page: req.query.page,
      limit: req.query.limit,
      field: req.query.field,
      contactOwnerId: req.user._id.toString(),
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await contactsService(
      req.query.page,
      req.query.limit,
      req.query.field,
      req.user._id
    );

    // console.log(req.user._id);
    return res.status(response.status).json({
      message: response.message,
      page: response.page,
      limit: response.limit,
      total: response.total,
      totalPages: response.totalPages,
      contacts: response.contacts,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while fetching all contacts:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const searchContacts = async (req, res) => {
  try {
    // console.log(
    //   req.query.page,
    //   req.query.limit,
    //   req.query.field,
    //   req.query.search,
    //   req.user._id
    // );

    const { error } = searchContactsSchema.validate({
      page: req.query.page,
      limit: req.query.limit,
      field: req.query.field,
      search: req.query.search,
      contactOwnerId: req.user._id.toString(),
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await searchContactsService(
      req.query.page,
      req.query.limit,
      req.query.field,
      req.query.search,
      req.user._id
    );

    // console.log(response);

    return res.status(response.status).json({
      message: response.message,
      page: response.page,
      limit: response.limit,
      total: response.total,
      totalPages: response.totalPages,
      contacts: response.contacts,
    });
  } catch (error) {
    console.error('Error while search the contact:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while search the contact:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const contactDetail = async (req, res) => {
  try {
    // console.log(req.query);

    const { error } = contactDetailSchema.validate({
      contactId: req.query.contactId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await contactDetailService(req.query.contactId);
    return res.status(response.status).json({
      message: response.message,
      contact: response.contact,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while getting contact detail:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const editContact = async (req, res) => {
  try {
    // console.log(req.body);
    const { error } = editContactSchema.validate({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      contactId: req.body.contactId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await editContactService(
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.contactId
    );

    return res.status(response.status).json({
      message: response.message,
      contact: response.contact,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('error while edit the contact:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const addContact = async (req, res) => {
  try {
    const { error } = addContactSchema.validate({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      contactOwnerId: req.user._id.toString(),
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await addContactService(
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.age,
      req.user._id
    );

    return res.status(response.status).json({
      message: response.message,
      contactCreated: response.contactCreated,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while creating new contact:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
